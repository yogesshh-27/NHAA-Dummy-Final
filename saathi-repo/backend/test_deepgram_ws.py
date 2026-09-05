"""
Quick test: Verify Deepgram WebSocket connection works through the backend proxy.
1. Start a session
2. Connect to the WebSocket
3. Send a small silence buffer
4. Check we get a connected message and no errors
"""
import asyncio
import json
import struct
import websockets
import requests

BACKEND = "http://127.0.0.1:8000"
WS_BACKEND = "ws://127.0.0.1:8000"

async def test_deepgram_ws():
    print("1. Starting a new session...")
    res = requests.post(f"{BACKEND}/api/sessions/start", data={"operator_name": "Test"})
    data = res.json()
    session_id = data["session_id"]
    print(f"   Session created: {session_id}")

    print("2. Connecting to WebSocket proxy...")
    ws_url = f"{WS_BACKEND}/api/sessions/{session_id}/ws"
    
    try:
        async with websockets.connect(ws_url, close_timeout=5) as ws:
            # Wait for connected message
            msg = await asyncio.wait_for(ws.recv(), timeout=10)
            parsed = json.loads(msg)
            print(f"   Received: {parsed}")
            
            if parsed.get("type") == "error":
                print(f"   ERROR: {parsed.get('error')}")
                return False
            
            if parsed.get("type") == "connected":
                print("   SUCCESS: Connected to Deepgram via backend proxy!")
            
            # Send a small silence buffer (linear16, 16kHz, mono)
            # 0.5 seconds of silence = 16000 * 0.5 = 8000 samples
            silence = b'\x00\x00' * 8000
            await ws.send(silence)
            print("3. Sent 0.5s of silence audio...")
            
            # Wait for any response (metadata or empty transcript)
            try:
                response = await asyncio.wait_for(ws.recv(), timeout=5)
                parsed_resp = json.loads(response)
                print(f"   Response type: {parsed_resp.get('type')}")
                if parsed_resp.get("type") == "error":
                    print(f"   ERROR from Deepgram: {parsed_resp.get('error')}")
                    return False
                print(f"   SUCCESS: Deepgram is responding!")
            except asyncio.TimeoutError:
                print("   No transcript response (expected for silence)")
            
            # Send stop signal
            await ws.send(json.dumps({"type": "stop"}))
            print("4. Sent stop signal")
            
            print("\n=== DEEPGRAM INTEGRATION TEST PASSED ===")
            return True
            
    except Exception as e:
        print(f"   Connection error: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_deepgram_ws())
    if not result:
        print("\n=== DEEPGRAM INTEGRATION TEST FAILED ===")
