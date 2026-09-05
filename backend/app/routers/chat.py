"""
SAATHI-AI Assistant Chat Router — Instant Gemini AI Integration
Guarantees ultra-fast responses without hanging or infinite loading.
"""

import os
import json
import logging
import asyncio
import urllib.request
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

logger = logging.getLogger("routers.chat")

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatMessage(BaseModel):
    sender: str  # "user" | "assistant"
    text: str

class CaseContext(BaseModel):
    case_id: Optional[str] = None
    case_number: Optional[str] = None
    district: Optional[str] = None
    svi_score: Optional[int] = None
    svi_label: Optional[str] = None
    case_brief: Optional[str] = None
    detected_keywords: Optional[List[str]] = None
    indicators: Optional[List[Dict[str, Any]]] = None
    transcript_summary: Optional[str] = None
    engine2_precedent: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    case_context: Optional[CaseContext] = None

SAATHI_SYSTEM_PROMPT = """You are SAATHI-AI Assistant, a smart, helpful, ChatGPT/Gemini-style AI companion and decision-support assistant for the SAATHI-AI Emergency Helpline platform (SIH26093).
You assist both citizens (users) and helpline operators.

PROJECT CONTEXT & SYSTEM OVERVIEW:
- SAATHI-AI is an explainable decision-support system for Indian emergency helplines (112, 100, 1091, 1098, 181).
- Engine 1: Real-time audio streaming, speech-to-text (STT via Deepgram), 15 distress category indicator detection, and live Speech Vulnerability Index (SVI 0-100) scoring.
- Engine 2: Historical precedent matching (TF-IDF vector similarity), regional incident cluster analysis, and delay risk bottleneck prediction.
- 15 Distress Categories: Threat/Intimidation, Fear/Distress, Immediate Safety, Self-Harm Risk, Physical Violence, Sexual Violence, Domestic Violence, Stalking, Isolation Cues, Coercion, Social Pressure, Vulnerability Cues, Medical Emergency, Current Safety Reassurance, Emergency Request for Help.

INSTRUCTIONS:
1. Answer ANY reasonable question asked by the user naturally, concisely, and accurately (like ChatGPT / Google Gemini).
2. Answer general questions (e.g. general knowledge, helpline numbers like 112, math, code, recipes, system features) directly.
3. If an active case context is provided below, use its real details to answer case inquiries. Never invent fake case details. If no case context exists, answer normally without fake case info.
"""

def _get_gemini_api_key() -> Optional[str]:
    """Retrieve server-side GEMINI_API_KEY from environment."""
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if key:
        return key
    try:
        root_env = Path(__file__).resolve().parents[3] / ".env"
        if root_env.exists():
            load_dotenv(dotenv_path=root_env)
            key = os.environ.get("GEMINI_API_KEY", "").strip()
            if key:
                return key
    except Exception:
        pass
    return None


@router.post("")
async def chat_with_assistant(req: ChatRequest):
    gemini_key = _get_gemini_api_key()

    # Format real active case context if present
    context_str = ""
    if req.case_context and (req.case_context.case_id or req.case_context.case_number):
        ctx = req.case_context
        context_str = f"\n[REAL ACTIVE CASE CONTEXT]\n"
        context_str += f"- Case Number/ID: {ctx.case_number or ctx.case_id}\n"
        if ctx.district: context_str += f"- District: {ctx.district}\n"
        if ctx.svi_score is not None: context_str += f"- Current SVI Score: {ctx.svi_score}/100 ({ctx.svi_label or 'N/A'})\n"
        if ctx.case_brief: context_str += f"- Case Brief: {ctx.case_brief}\n"
        if ctx.detected_keywords: context_str += f"- Detected Keywords: {', '.join(ctx.detected_keywords)}\n"
        if ctx.transcript_summary: context_str += f"- Recent Transcript Snippets: {ctx.transcript_summary}\n"
        if ctx.engine2_precedent: context_str += f"- Engine 2 Precedent: {ctx.engine2_precedent}\n"
    else:
        context_str = "\n[CONTEXT]: No active case selected. Answering as a general system & helpline assistant.\n"

    full_system_prompt = SAATHI_SYSTEM_PROMPT + context_str

    # 1. Attempt live Google Gemini API call with strict 3.0s timeout if valid key exists
    if gemini_key and gemini_key.startswith("AIzaSy"):
        try:
            gemini_reply = await asyncio.wait_for(
                _invoke_gemini_sdk(gemini_key, full_system_prompt, req.history or [], req.message),
                timeout=3.0
            )
            if gemini_reply and len(gemini_reply.strip()) > 0:
                return {"reply": gemini_reply, "status": "gemini_dynamic_success"}
        except Exception as e:
            logger.warning("Gemini API call timeout/error: %s", e)

    # 2. Instant fallback response to ensure UI NEVER hangs on "Thinking..."
    reply = _get_instant_assistant_reply(req.message, req.case_context)
    return {"reply": reply, "status": "instant_response"}


def _get_instant_assistant_reply(user_msg: str, ctx: Optional[CaseContext]) -> str:
    """Instant fallback assistant response for any query to ensure 0ms UI delay."""
    msg = user_msg.strip().lower()

    if any(w in msg for w in ["hi", "hello", "namaste", "hey", "hlo", "hii", "helo"]) and len(msg.split()) <= 3:
        return "Namaste! I am your SAATHI-AI Assistant. How can I help you today? Ask me any question about helpline numbers (112), safety guidance, or platform tools."

    if any(w in msg for w in ["toll", "number", "helpline", "phone", "contact", "call police", "emergency number", "dial"]):
        return (
            "📞 **Emergency Toll-Free Helpline Numbers in India:**\n\n"
            "- 🚨 **National Emergency Number:** `112` (Police, Fire, Medical)\n"
            "- 🚔 **Police Helpline:** `100` / `112` \n"
            "- 👩 **Women Helpline:** `1091`\n"
            "- 🛡️ **Women Distress / Domestic Violence:** `181`\n"
            "- 👶 **Childline Helpline:** `1098`\n"
            "- 🚑 **Ambulance / Medical:** `102` / `108` \n"
            "- 👵 **Senior Citizen Helpline:** `14567`\n"
            "- 💻 **National Cyber Crime Helpline:** `1930`"
        )

    if ctx and (ctx.case_id or ctx.case_number) and any(w in msg for w in ["case", "svi", "flag", "brief"]):
        return (
            f"**Active Case {ctx.case_number or ctx.case_id} Details:**\n"
            f"- **District:** {ctx.district or 'Sant Kabir Nagar'}\n"
            f"- **SVI Score:** {ctx.svi_score or 0}/100 ({ctx.svi_label or 'active'})\n"
            f"- **Detected Keywords:** {', '.join(ctx.detected_keywords) if ctx.detected_keywords else 'None'}\n"
            f"- **Brief:** {ctx.case_brief or 'Live call session active.'}"
        )

    return (
        f"I am your SAATHI-AI Assistant. You asked: **'{user_msg}'**.\n\n"
        "I can assist you with:\n"
        "- 📞 **Emergency Numbers:** Dial 112 for all emergencies in India.\n"
        "- 📊 **SVI Scoring & Engine 1/2:** Real-time caller distress analysis & precedent matching.\n"
        "- 🛡️ **Helpline Guidance:** Feel free to ask any question regarding safety protocols or system features!"
    )


async def _invoke_gemini_sdk(
    api_key: str,
    system_prompt: str,
    history: List[ChatMessage],
    message: str
) -> Optional[str]:
    """Execute Gemini API call in background thread."""
    return await asyncio.get_event_loop().run_in_executor(
        None, _sync_gemini_sdk_call, api_key, system_prompt, history, message
    )


def _sync_gemini_sdk_call(
    api_key: str,
    system_prompt: str,
    history: List[ChatMessage],
    message: str
) -> Optional[str]:
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        prompt = message
        if history:
            recent_hist = "\n".join(f"{h.sender.capitalize()}: {h.text}" for h in history[-3:])
            prompt = f"Chat History:\n{recent_hist}\n\nUser Question: {message}"

        for model_name in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"]:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.4,
                        max_output_tokens=400,
                    )
                )
                if response and response.text:
                    return response.text.strip()
            except Exception:
                continue
    except Exception as e:
        logger.warning("SDK call exception: %s", e)
    return None
