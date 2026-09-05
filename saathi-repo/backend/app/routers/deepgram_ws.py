"""
Deepgram Real-Time STT WebSocket Proxy

Architecture:
  Browser Microphone (WebM Opus) → Backend WebSocket → Deepgram WS
  Deepgram transcripts → Engine 1 SVI Pipeline → Browser WebSocket

The DEEPGRAM_API_KEY stays entirely server-side in .env.
"""

import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.ai_engine_1.deepgram_client import (
    create_deepgram_connection,
    parse_deepgram_response,
    close_deepgram_connection,
    DeepgramStreamError,
)
import app.ai_engine_1 as engine1
from app.ai_engine_1.session_manager import (
    get_session,
    touch_session,
    set_session_status,
)

logger = logging.getLogger("router.deepgram_ws")
router = APIRouter(tags=["Deepgram WebSocket"])


async def handle_deepgram_session(websocket: WebSocket, session_id: str, language: str = "hi-IN"):
    """
    Core WebSocket proxy handler that connects browser mic stream to Deepgram
    and streams back real-time captions, SVI scores, indicators & co-pilot guidance.
    """
    await websocket.accept()

    state = get_session(session_id)
    if state is None:
        await websocket.send_json({
            "type": "error",
            "message": f"Session {session_id} not found. Please start a live session.",
        })
        await websocket.close(code=4004, reason="Session not found")
        return

    # Mark session as Active and touch last activity
    touch_session(session_id, status="Active")

    deepgram_ws = None
    try:
        deepgram_ws = await create_deepgram_connection(language=language)
    except DeepgramStreamError as e:
        error_msg = str(e)
        logger.error("Deepgram connection error for session %s: %s", session_id, error_msg)
        await websocket.send_json({
            "type": "error",
            "message": error_msg,
        })
        await websocket.close(code=4001, reason="Deepgram connection failed")
        return
    except Exception as e:
        logger.error("Unexpected error connecting to Deepgram: %s", e)
        await websocket.send_json({
            "type": "error",
            "message": f"Failed to connect to Deepgram: {e}",
        })
        await websocket.close(code=4001, reason="Deepgram connection failed")
        return

    await websocket.send_json({
        "type": "connected",
        "message": "Deepgram real-time speech recognition active (nova-2)",
    })

    async def relay_deepgram_to_browser():
        """Read transcript frames from Deepgram WS and forward to browser."""
        try:
            async for message in deepgram_ws:
                parsed = parse_deepgram_response(message)

                if parsed["type"] == "transcript":
                    transcript_text = parsed.get("transcript", "")
                    is_final = parsed.get("is_final", False)

                    if not is_final:
                        # Send interim live captions to browser
                        if transcript_text:
                            await websocket.send_json({
                                "type": "interim",
                                "text": transcript_text,
                            })
                    else:
                        # Final transcript chunk -> process through Engine 1
                        if transcript_text.strip():
                            try:
                                result = engine1.process_text_segment(
                                    session_id=session_id,
                                    text=transcript_text.strip(),
                                    chunk_duration_seconds=parsed.get("duration", 3.5) or 3.5,
                                    stt_source="deepgram_realtime",
                                )
                                # Send comprehensive final payload to browser
                                await websocket.send_json({
                                    "type": "final",
                                    "text": transcript_text.strip(),
                                    **result,
                                })
                            except Exception as eng_err:
                                logger.warning("Engine 1 update error: %s", eng_err)
                                await websocket.send_json({
                                    "type": "final",
                                    "text": transcript_text.strip(),
                                })

                elif parsed["type"] == "error":
                    await websocket.send_json({
                        "type": "error",
                        "message": parsed.get("error", "Deepgram streaming error"),
                    })

        except Exception as e:
            if "close" not in str(e).lower() and "1000" not in str(e):
                logger.error("Deepgram relay loop exception: %s", e)

    relay_task = asyncio.create_task(relay_deepgram_to_browser())

    try:
        while True:
            data = await websocket.receive()

            if data.get("type") == "websocket.disconnect":
                break

            # Binary audio bytes from browser MediaRecorder
            if "bytes" in data and data["bytes"]:
                try:
                    await deepgram_ws.send(data["bytes"])
                except Exception as e:
                    logger.error("Error sending audio bytes to Deepgram: %s", e)
                    await websocket.send_json({
                        "type": "error",
                        "message": "Lost connection to Deepgram real-time stream.",
                    })
                    break

            # Text control frame
            elif "text" in data and data["text"]:
                try:
                    msg = json.loads(data["text"])
                    if msg.get("type") == "stop":
                        break
                except json.JSONDecodeError:
                    pass

    except WebSocketDisconnect:
        logger.info("Browser WebSocket disconnected for session %s", session_id)
    except Exception as e:
        logger.error("WebSocket error for session %s: %s", session_id, e)
    finally:
        relay_task.cancel()
        try:
            await relay_task
        except (asyncio.CancelledError, Exception):
            pass

        if deepgram_ws:
            await close_deepgram_connection(deepgram_ws)

        # If session is still alive in memory and not completed, mark as Disconnected
        set_session_status(session_id, "Disconnected")

        logger.info("Deepgram proxy session completed: %s", session_id)


@router.websocket("/api/deepgram/ws/{session_id}")
async def deepgram_ws_route1(websocket: WebSocket, session_id: str, language: str = "hi-IN"):
    await handle_deepgram_session(websocket, session_id, language)


@router.websocket("/api/sessions/{session_id}/ws")
async def deepgram_ws_route2(websocket: WebSocket, session_id: str, language: str = "hi-IN"):
    await handle_deepgram_session(websocket, session_id, language)
