"""
Saathi AI Safety Model — Python sidecar
=======================================

A tiny standalone HTTP service that loads backend/saathi_model/safety_model.pkl
once at startup and exposes a single POST endpoint /score that returns the
safety classification for a piece of text.

The Node backend (server/safetyClassifier.ts) talks to this sidecar over
localhost. If the sidecar is unreachable, the Node side falls back to
DEMO_MODE keyword heuristics so the system never blocks a real user.

Run:
    python backend/saathi_model/safety_model_server.py [--port 8765]

Endpoints:
    GET  /health         -> { ok, threshold, version }
    POST /score          -> body: { "text": "..." }  -> { score, label, label_str, threshold, decision }
"""

from __future__ import annotations

import argparse
import json
import os
import pickle
import sys
from pathlib import Path
from typing import Any

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


HERE = Path(__file__).resolve().parent
DEFAULT_MODEL = HERE / "safety_model.pkl"
DEFAULT_THRESHOLD = float(os.environ.get("SAATHI_SAFETY_THRESHOLD", "0.5"))


def load_model(model_path: Path):
    if not model_path.exists():
        raise SystemExit(
            f"safety_model.pkl not found at {model_path}. "
            f"Run `python backend/saathi_model/train_safety_model.py` first."
        )
    with model_path.open("rb") as f:
        payload = pickle.load(f)
    return payload


def make_handler(state: dict[str, Any]):
    pipe = state["pipeline"]
    threshold = state["threshold"]
    label_map = state["label_map"]

    class Handler(BaseHTTPRequestHandler):
        # Quieter logs
        def log_message(self, format, *args):
            pass

        def _send_json(self, status: int, obj: dict):
            body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path == "/health":
                self._send_json(200, {
                    "ok": True,
                    "threshold": threshold,
                    "version": state.get("version", "unknown"),
                    "labels": label_map,
                })
            else:
                self._send_json(404, {"error": "not_found"})

        def do_POST(self):
            if self.path != "/score":
                self._send_json(404, {"error": "not_found"})
                return
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length) if length > 0 else b"{}"
            try:
                payload = json.loads(raw.decode("utf-8"))
                text = payload.get("text") or ""
                thr_override = payload.get("threshold")
            except Exception as e:
                self._send_json(400, {"error": "bad_json", "detail": str(e)})
                return

            if not isinstance(text, str) or not text.strip():
                self._send_json(200, {
                    "score": 0.0,
                    "label": 0,
                    "label_str": "safe",
                    "decision": "safe",
                    "threshold": thr_override if isinstance(thr_override, (int, float)) else threshold,
                })
                return

            try:
                proba = pipe.predict_proba([text])[0]
                # safety_threat is class 1 (we trained it that way)
                score = float(proba[1])
            except Exception as e:
                self._send_json(500, {"error": "inference_failed", "detail": str(e)})
                return

            used_threshold = float(thr_override) if isinstance(thr_override, (int, float)) else threshold
            label = 1 if score >= used_threshold else 0
            label_str = label_map.get(label, "safe" if label == 0 else "safety_threat")

            self._send_json(200, {
                "score": score,
                "label": label,
                "label_str": label_str,
                "decision": label_str,
                "threshold": used_threshold,
            })

    return Handler


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=int(os.environ.get("SAATHI_SAFETY_PORT", "8765")))
    parser.add_argument("--host", default=os.environ.get("SAATHI_SAFETY_HOST", "127.0.0.1"))
    parser.add_argument("--model", default=str(DEFAULT_MODEL))
    args = parser.parse_args()

    print(f"[saathi-safety] Loading model from {args.model}")
    payload = load_model(Path(args.model))
    state = {
        "pipeline": payload["pipeline"],
        "threshold": float(payload.get("threshold", DEFAULT_THRESHOLD)),
        "label_map": payload.get("label_map", {1: "safety_threat", 0: "safe"}),
        "version": payload.get("version", "unknown"),
    }
    print(f"[saathi-safety] Ready. threshold={state['threshold']} version={state['version']}")

    handler = make_handler(state)
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"[saathi-safety] HTTP sidecar listening on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[saathi-safety] Shutting down.")
        server.server_close()


if __name__ == "__main__":
    main()
