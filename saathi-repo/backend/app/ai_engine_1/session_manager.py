"""
Engine 1: In-Memory Session State Manager

Manages active live session states. Each session has an SVIState that persists
across all audio chunks received during that session.

Phase 1: In-memory dict. Session state is lost on server restart — acceptable for demo.
Future phase: Replace with Redis or DB-backed session store without changing the API.
"""

import time
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional, List
from .svi_engine import SVIState

# In-memory session store: session_id → SVIState
_sessions: Dict[str, SVIState] = {}
_session_meta: Dict[str, dict] = {}


def create_session(
    operator_name: str = "Operator",
    client_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> str:
    """Create a new live session with caller/client request metadata and return the session_id."""
    session_id = str(uuid.uuid4())[:8]
    _sessions[session_id] = SVIState(session_id=session_id)
    now_utc = datetime.now(timezone.utc)
    now_iso = now_utc.isoformat()
    now_epoch = time.time()

    _session_meta[session_id] = {
        "session_id": session_id,
        "operator_name": operator_name or "Operator",
        "client_ip": client_ip or "127.0.0.1",
        "user_agent": user_agent or "Web Client",
        "started_at": now_epoch,
        "created_at_iso": now_iso,
        "last_activity_at": now_epoch,
        "last_activity_iso": now_iso,
        "connection_status": "Online",
        "chunk_count": 0,
    }
    return session_id


def get_session(session_id: str) -> Optional[SVIState]:
    """Retrieve session state, or None if not found."""
    return _sessions.get(session_id)


def update_session(session_id: str, state: SVIState) -> None:
    """Save updated session state and update last activity."""
    _sessions[session_id] = state
    if session_id in _session_meta:
        now_epoch = time.time()
        now_iso = datetime.now(timezone.utc).isoformat()
        _session_meta[session_id]["chunk_count"] = state.chunk_count
        _session_meta[session_id]["last_activity_at"] = now_epoch
        _session_meta[session_id]["last_activity_iso"] = now_iso
        # If active audio/text is streaming, mark as Active
        if _session_meta[session_id].get("connection_status") != "Completed":
            _session_meta[session_id]["connection_status"] = "Active"


def touch_session(session_id: str, status: Optional[str] = None) -> None:
    """Update last activity timestamp and optionally update connection status."""
    if session_id in _session_meta:
        now_epoch = time.time()
        now_iso = datetime.now(timezone.utc).isoformat()
        _session_meta[session_id]["last_activity_at"] = now_epoch
        _session_meta[session_id]["last_activity_iso"] = now_iso
        if status:
            _session_meta[session_id]["connection_status"] = status


def set_session_status(session_id: str, status: str) -> None:
    """Update connection status (e.g. Online, Active, Disconnected, Completed)."""
    if session_id in _session_meta:
        _session_meta[session_id]["connection_status"] = status


def get_session_meta(session_id: str) -> Optional[dict]:
    return _session_meta.get(session_id)


def list_active_sessions() -> List[dict]:
    """Return list of all currently active session descriptors."""
    results = []
    for sid, meta in list(_session_meta.items()):
        state = _sessions.get(sid)
        if state is not None:
            results.append({
                "session_id": sid,
                "meta": meta,
                "state": state,
            })
    return results


def close_session(session_id: str) -> Optional[SVIState]:
    """Remove session from memory and return final state."""
    state = _sessions.pop(session_id, None)
    _session_meta.pop(session_id, None)
    return state

