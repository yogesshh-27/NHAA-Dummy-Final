"""
SAATHI-AI 21-Category Multilingual Indicator Detection Model Trainer
=====================================================================
Trains a calibrated Word + Char n-gram TF-IDF pipeline to classify multilingual
(Hindi, English, Hinglish) caller and operator speech into 21 categories.

Outputs:
  - backend/saathi_model/indicator_model.pkl
  - backend/saathi_model/indicator_evaluation_report.json
"""

import json
import pickle
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sklearn.pipeline import FeatureUnion, Pipeline

HERE = Path(__file__).resolve().parent
PROJECT_ROOT = HERE.parent
DATASET_PATH = PROJECT_ROOT / "training_data" / "multilingual_indicator_dataset.json"
MODEL_OUTPUT_PATH = HERE / "indicator_model.pkl"
REPORT_OUTPUT_PATH = HERE / "indicator_evaluation_report.json"


def normalise_text(text: str) -> str:
    """
    Lowercase, preserve Devanagari and Latin letters, strip redundant spaces.
    """
    text = (text or "").lower()
    # Normalize excessive punctuation but keep basic words and Devanagari
    text = re.sub(r"[^\w\s\u0900-\u097F]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_dataset() -> Tuple[List[str], List[str], List[dict]]:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}. Run generator first.")

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    texts = [normalise_text(item["text"]) for item in data]
    labels = [item["label"] for item in data]
    return texts, labels, data


def build_pipeline() -> Pipeline:
    """
    Build dual-granularity TF-IDF feature extractor + Calibrated Multiclass Classifier.
    - Word n-grams (1, 2) capture semantic phraseology
    - Char n-grams (3, 5) capture transliteration, phonetic typos, and morphology
    """
    word_vec = TfidfVectorizer(
        analyzer="word",
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.98,
        sublinear_tf=True,
    )

    char_vec = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(3, 5),
        min_df=1,
        max_df=0.98,
        sublinear_tf=True,
    )

    features = FeatureUnion([
        ("word", word_vec),
        ("char", char_vec),
    ])

    classifier = LogisticRegression(
        C=4.0,
        max_iter=2500,
        class_weight="balanced",
        solver="lbfgs",
        random_state=42,
    )

    return Pipeline([
        ("features", features),
        ("clf", classifier),
    ])


def train_and_evaluate():
    texts, labels, raw_data = load_dataset()
    unique_labels = sorted(list(set(labels)))
    print(f"Loaded {len(texts)} samples across {len(unique_labels)} classes.")

    # 80/20 Stratified Split
    X_train, X_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.20,
        random_state=42,
        stratify=labels,
    )

    print(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")
    print("Training feature union pipeline...")

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    print("Pipeline trained. Evaluating on test set...")
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    # Global Accuracy
    overall_accuracy = accuracy_score(y_test, y_pred)

    # Detailed Classification Metrics
    p_per_cat, r_per_cat, f1_per_cat, s_per_cat = precision_recall_fscore_support(
        y_test,
        y_pred,
        labels=unique_labels,
        zero_division=0,
    )

    full_report = classification_report(
        y_test,
        y_pred,
        labels=unique_labels,
        output_dict=True,
        zero_division=0,
    )

    category_metrics = {}
    for i, label in enumerate(unique_labels):
        category_metrics[label] = {
            "precision": round(float(p_per_cat[i]), 4),
            "recall": round(float(r_per_cat[i]), 4),
            "f1_score": round(float(f1_per_cat[i]), 4),
            "test_support": int(s_per_cat[i]),
        }

    evaluation_report = {
        "version": "1.0.0",
        "total_samples": len(texts),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "num_categories": len(unique_labels),
        "overall_accuracy": round(float(overall_accuracy), 4),
        "macro_avg_precision": round(float(full_report["macro avg"]["precision"]), 4),
        "macro_avg_recall": round(float(full_report["macro avg"]["recall"]), 4),
        "macro_avg_f1": round(float(full_report["macro avg"]["f1-score"]), 4),
        "weighted_avg_f1": round(float(full_report["weighted avg"]["f1-score"]), 4),
        "categories": category_metrics,
    }

    # Save evaluation report JSON
    with open(REPORT_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(evaluation_report, f, indent=2, ensure_ascii=False)

    # Save model artifact
    model_payload = {
        "pipeline": pipeline,
        "labels": unique_labels,
        "classes": list(pipeline.named_steps["clf"].classes_),
        "version": "1.0.0",
        "overall_accuracy": overall_accuracy,
    }

    with open(MODEL_OUTPUT_PATH, "wb") as f:
        pickle.dump(model_payload, f)

    # Print summary table
    print("\n" + "=" * 82)
    print(f"SAATHI-AI 21-CATEGORY INDICATOR MODEL EVALUATION RESULTS")
    print("=" * 82)
    print(f"{'CATEGORY':<42} | {'PRECISION':<9} | {'RECALL':<8} | {'F1-SCORE':<8} | {'SUPPORT':<7}")
    print("-" * 82)
    for cat in unique_labels:
        m = category_metrics[cat]
        print(f"{cat:<42} | {m['precision']:<9.4f} | {m['recall']:<8.4f} | {m['f1_score']:<8.4f} | {m['test_support']:<7}")
    print("-" * 82)
    print(f"{'OVERALL ACCURACY':<42} | {overall_accuracy:<9.4f}")
    print(f"{'MACRO AVERAGE F1':<42} | {evaluation_report['macro_avg_f1']:<9.4f}")
    print(f"{'WEIGHTED AVERAGE F1':<42} | {evaluation_report['weighted_avg_f1']:<9.4f}")
    print("=" * 82)
    print(f"\nModel saved to:  {MODEL_OUTPUT_PATH}")
    print(f"Report saved to: {REPORT_OUTPUT_PATH}")


if __name__ == "__main__":
    train_and_evaluate()
