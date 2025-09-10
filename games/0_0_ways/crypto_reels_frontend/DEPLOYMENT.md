# Deployment instructions for Crypto Reels Slot Game

## Backend (FastAPI)
1. Install dependencies:
   pip install fastapi uvicorn pydantic
2. Run the backend server:
   uvicorn games.0_0_ways.crypto_reels_frontend.backend_api:app --reload
   # (Adjust import paths if needed for your environment)

## Frontend (React)
1. Ensure Node.js and npm are installed.
2. In the frontend directory:
   npm install react react-dom
   # (Add Stake SDK if available: npm install @stake/web-sdk)
3. Use a tool like Vite, Create React App, or Parcel to serve/build the frontend.
   # Example with Vite:
   npm create vite@latest
   # Move CryptoReelsSlot.jsx into the src/ directory and import it in App.jsx
   npm install
   npm run dev

## Connecting Frontend and Backend
- The frontend fetches from http://localhost:8000 (FastAPI default).
- For production, deploy both with proper CORS and HTTPS settings.

## Stake SDK Integration
- Follow Stake's official docs to finish SDK wiring (authentication, wallet, events).
- Replace pseudo-code in CryptoReelsSlot.jsx with real SDK calls.

## RTP/Fairness
- Backend exposes /api/rtp for RTP reporting.
- For provable fairness, integrate Stake's or a third-party solution as required.

## Final Steps
- Test all features: spins, free spins, bonus, sticky wilds, wallet, and events.
- Polish UI and add sound/animation as desired.
- Submit for Stake review and certification.
