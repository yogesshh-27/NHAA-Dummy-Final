"""
Saathi AI Safety Model Trainer
==============================

Trains a TF-IDF + Logistic Regression pipeline that classifies free-form
citizen input (English / Hinglish / Hindi) into:
    1 -> safety_threat  (immediate physical danger / self-harm / weapon / attack)
    0 -> safe           (distress, harassment discussion, mental health concerns)

The output is a SINGLE .pkl file containing the full scikit-learn Pipeline
(TfidfVectorizer + LogisticRegression) plus metadata (threshold, label map,
version). The Node backend loads it via a small Python sidecar and never
parses the pickle itself.

Usage (from project root):
    python backend/saathi_model/train_safety_model.py

Output:
    backend/saathi_model/safety_model.pkl
"""

from __future__ import annotations

import json
import os
import pickle
import re
import sys
from pathlib import Path
from typing import List, Tuple

# Ensure we can import the .ts dataset via a tiny JSON bridge file.
HERE = Path(__file__).resolve().parent
PROJECT_ROOT = HERE.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from backend.saathi_model.dataset import SAFETY_TRAINING_DATA  # type: ignore
except Exception:
    # Fallback: load from exported JSON produced by `export_dataset_json.py`.
    json_path = HERE / "dataset.json"
    if not json_path.exists():
        raise SystemExit(
            "Could not import SAFETY_TRAINING_DATA and dataset.json not found. "
            "Run `node backend/saathi_model/export_dataset_json.cjs` first, "
            "or import the dataset from TypeScript directly."
        )
    with json_path.open("r", encoding="utf-8") as f:
        SAFETY_TRAINING_DATA = json.load(f)


# ===== Lightweight Hindi/Hinglish text normalisation ==============================
DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")


def normalise(text: str) -> str:
    """Lowercase, collapse whitespace, preserve Devanagari.

    We intentionally do NOT transliterate Devanagari -> Roman, because the
    TF-IDF model can learn both scripts. We do lowercase latin letters and
    strip extra whitespace so e.g. "Maar  Raha" and "maar raha" match.
    """
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_corpus() -> Tuple[List[str], List[int]]:
    texts = [normalise(ex["text"]) for ex in SAFETY_TRAINING_DATA]
    labels = [int(ex["label"]) for ex in SAFETY_TRAINING_DATA]
    return texts, labels


def build_pipeline():
    """Word + character n-gram TF-IDF + Logistic Regression.

    - word n-grams: capture vocabulary like 'kill', 'suicide', 'hathiyar'
    - char n-grams: handle morphology (e.g. 'hathiyar' / 'hathiyaar') and
      short Hinglish words robustly even when users misspell.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import FeatureUnion, Pipeline

    word_vec = TfidfVectorizer(
        analyzer="word",
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.95,
        sublinear_tf=True,
        strip_accents=None,
    )
    char_vec = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(3, 5),
        min_df=1,
        max_df=0.95,
        sublinear_tf=True,
    )
    features = FeatureUnion([("word", word_vec), ("char", char_vec)])

    clf = LogisticRegression(
        C=4.0,
        max_iter=2000,
        class_weight="balanced",
        solver="liblinear",
    )

    pipe = Pipeline([("features", features), ("clf", clf)])
    return pipe


def evaluate(pipe, texts, labels) -> dict:
    from sklearn.metrics import classification_report, f1_score

    preds = pipe.predict(texts)
    proba = pipe.predict_proba(texts)[:, 1]

    report = classification_report(labels, preds, target_names=["safe", "safety_threat"], output_dict=True)
    f1 = f1_score(labels, preds, average="binary", pos_label=1)
    return {
        "f1_threat": float(f1),
        "report": report,
        "proba_sample": [float(p) for p in proba[:10]],
    }


def cross_validate(pipe, texts, labels) -> dict:
    from sklearn.model_selection import StratifiedKFold, cross_val_score

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    f1_scores = cross_val_score(pipe, texts, labels, cv=cv, scoring="f1", n_jobs=-1)
    acc_scores = cross_val_score(pipe, texts, labels, cv=cv, scoring="accuracy", n_jobs=-1)
    return {
        "cv_f1_mean": float(f1_scores.mean()),
        "cv_f1_std": float(f1_scores.std()),
        "cv_acc_mean": float(acc_scores.mean()),
        "cv_acc_std": float(acc_scores.std()),
        "folds": len(f1_scores),
    }


def main():
    print("[saathi-safety] Loading corpus...")
    texts, labels = load_corpus()
    print(f"[saathi-safety] Corpus size: {len(texts)} examples | positive={sum(labels)} negative={len(labels)-sum(labels)}")

    print("[saathi-safety] Cross-validating (5-fold)...")
    pipe = build_pipeline()
    cv = cross_validate(pipe, texts, labels)
    print(f"[saathi-safety] CV F1(threat): {cv['cv_f1_mean']:.3f} ± {cv['cv_f1_std']:.3f}")
    print(f"[saathi-safety] CV Accuracy : {cv['cv_acc_mean']:.3f} ± {cv['cv_acc_std']:.3f}")

    print("[saathi-safety] Fitting final model on full data...")
    pipe.fit(texts, labels)

    metrics = evaluate(pipe, texts, labels)
    print(f"[saathi-safety] Train F1(threat): {metrics['f1_threat']:.3f}")

    out_path = HERE / "safety_model.pkl"
    payload = {
        "pipeline": pipe,
        "threshold": float(os.environ.get("SAATHI_SAFETY_THRESHOLD", "0.5")),
        "label_map": {1: "safety_threat", 0: "safe"},
        "version": "1.0.0",
        "metrics": {**cv, "train_f1_threat": metrics["f1_threat"]},
    }
    with out_path.open("wb") as f:
        pickle.dump(payload, f)
    print(f"[saathi-safety] Saved model to {out_path}")

    # Also write a JSON metadata sidecar for the Node sidecar to read first
    # (so it can fail fast if the .pkl is missing without booting Python).
    meta_path = HERE / "safety_model.meta.json"
    meta = {
        "version": payload["version"],
        "threshold": payload["threshold"],
        "label_map": payload["label_map"],
        "metrics": payload["metrics"],
    }
    with meta_path.open("w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"[saathi-safety] Saved metadata to {meta_path}")


if __name__ == "__main__":
    main()
