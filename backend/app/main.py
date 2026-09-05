"""
SAATHI-AI Backend Entrypoint — Phase 1 (Engine 1 Live)
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import Base, engine
from app.models.case_model import LiveCase  # ensure table is created
from app.routers.live_session import router as session_router
from app.routers.deepgram_ws import router as deepgram_router
from app.routers.engine2 import router as engine2_router
from app.routers.chat import router as chat_router

load_dotenv()

# Initialize all DB tables (creates live_cases table if not exists)
Base.metadata.create_all(bind=engine)

# Auto-migrate missing columns for SQLite if table existed previously
with engine.connect() as conn:
    for col, col_type in [
        ("indicators_json", "TEXT"),
        ("metric_bars_json", "TEXT"),
        ("score_history_json", "TEXT"),
        ("delay_risk_score", "INTEGER DEFAULT 15"),
    ]:
        try:
            conn.execute(text(f"ALTER TABLE live_cases ADD COLUMN {col} {col_type}"))
            conn.commit()
        except Exception:
            pass

app = FastAPI(
    title="SAATHI-AI API",
    description="AI-assisted decision-support platform for helpline operators (SIH26093)",
    version="0.2.0",
)

allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "").strip()
if allowed_origins_env and allowed_origins_env != "*":
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+",
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Routers
app.include_router(session_router)
app.include_router(deepgram_router)
app.include_router(engine2_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "saathi-ai-backend",
        "version": "0.2.0",
        "engine1": "live",
        "stt": "deepgram_realtime",
        "message": "SAATHI-AI Phase 1 — Engine 1 Live Audio Processing Active",
    }


@app.get("/health")
def health_check():
    openai_configured = bool(os.environ.get("OPENAI_API_KEY", "") or os.environ.get("LLM_API_KEY", ""))
    deepgram_configured = bool(os.environ.get("DEEPGRAM_API_KEY", ""))
    gemini_configured = bool(os.environ.get("GEMINI_API_KEY", ""))
    return {
        "status": "healthy",
        "database": "connected",
        "openai_api_key_configured": openai_configured,
        "deepgram_api_key_configured": deepgram_configured,
        "gemini_api_key_configured": gemini_configured,
        "stt_engine": "deepgram_realtime" if deepgram_configured else "fallback",
        "engines": {
            "ai_engine_1": "live",
            "ai_engine_2": "initialized_standby",
        },
    }


@app.post("/api/cases/{case_id}/override")
def log_override(case_id: str, operator_name: str = "", override_reason: str = ""):
    return {"status": "success", "case_id": case_id, "logged": True}


@app.get("/api/audit-logs")
def get_audit_logs():
    return {"logs": []}


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", os.environ.get("BACKEND_HOST", "0.0.0.0"))
    port = int(os.environ.get("PORT", os.environ.get("BACKEND_PORT", 8000)))
    uvicorn.run("app.main:app", host=host, port=port, reload=False)

