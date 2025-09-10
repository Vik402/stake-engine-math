# Backend API for Crypto Reels Slot
# FastAPI app to connect frontend and slot logic

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../sweet_slot')))
from slot import CryptoReelsSlot

app = FastAPI()

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

slot = CryptoReelsSlot()

class SpinRequest(BaseModel):
    bet: int
    sticky_wilds: list = []


@app.post("/api/spin")
async def spin(req: SpinRequest):
    try:
        if req.bet <= 0:
            return {"error": "Bet must be positive."}
        result = slot.spin(req.bet, req.sticky_wilds)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/bonus")
async def bonus():
    try:
        result = slot.play_bonus()
        return result
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/balance")
async def balance():
    try:
        return {"balance": slot.get_balance()}
    except Exception as e:
        return {"error": str(e)}

# RTP/Fairness endpoint stub
@app.get("/api/rtp")
async def rtp():
    # In production, calculate actual RTP from game data
    return {"rtp": 96.5}  # Example RTP value
