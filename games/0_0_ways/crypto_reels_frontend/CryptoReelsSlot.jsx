// Crypto Reels Slot Frontend Scaffold
// This is a placeholder for the main React component
// Integrate Stake Web SDK and connect to backend API


// Import Stake Web SDK (assume it's installed and available)
// import StakeSDK from '@stake/web-sdk';
import React, { useState, useEffect, useRef } from 'react';
// Sound and music hooks (user-provided files)
const spinSound = new window.Audio('/sounds/dp07lemjo2-slot-machine-sfx-4.mp3');
const winSound = new window.Audio('/sounds/11L-Massive_synth_burst_-1755564810290.mp3');
const bigWinSound = new window.Audio('/sounds/11L-Cinematic_swell_with-1755564557960.mp3');
const bgMusic = new window.Audio('/sounds/11L-Slow,_pulsing_ambien-1755565392729.mp3');
const bonusSound = new window.Audio('/sounds/11L-Futuristic_scatter_l-1755564450537.mp3');
const stickyWildSound = new window.Audio('/sounds/11L-Electric_shimmer_wit-1755564492776.mp3');
const clickSound = new window.Audio('/sounds/11L-Sharp_digital_click_-1755565202505.mp3');
bgMusic.loop = true;
  const [bet, setBet] = useState(1);
  const [recentWins, setRecentWins] = useState([]);
  const [showBigWin, setShowBigWin] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [provableSeed, setProvableSeed] = useState('123ABCSEED');
  const slotGridRef = useRef();
  // Play background music on mount
  useEffect(() => {
    bgMusic.volume = 0.2;
    bgMusic.play().catch(() => {});
    return () => { bgMusic.pause(); };
  }, []);


// Symbol to emoji/icon mapping for better visuals
const symbolIcons = {
  Bitcoin: '₿',
  Ethereum: 'Ξ',
  Dogecoin: 'Ð',
  Litecoin: 'Ł',
  Ripple: '✕',
  Tether: '₮',
  Cardano: '₳',
  BNB: '🟡',
  Scatter: '⭐',
  Bonus: '🎰',
  '-': '·'
};

export default function CryptoReelsSlot() {
  const [grid, setGrid] = useState([]);
  const [win, setWin] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const [isFreeSpin, setIsFreeSpin] = useState(false);
  const [stickyWilds, setStickyWilds] = useState([]);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);


  // Example: Stake SDK integration points
  useEffect(() => {
    // Example Stake SDK integration (pseudo-code)
    // StakeSDK.init({ ... });
    // StakeSDK.on('authenticated', (user) => setUser(user));
    // StakeSDK.on('walletUpdate', (wallet) => setWallet(wallet));
    // Optionally, auto-authenticate or prompt login
  }, []);

  // Connect to backend API for spins
  const spinReels = async () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
    spinSound.currentTime = 0;
    spinSound.play().catch(() => {});
    try {
      const response = await fetch('http://localhost:8000/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bet: 1, sticky_wilds: stickyWilds })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setGrid(data.grid);
      setWin(data.win);
      setFreeSpins(data.free_spins);
      setBonusTriggered(data.bonus_triggered);
      setIsFreeSpin(data.is_free_spin);
      setStickyWilds(data.sticky_wilds);
      setRecentWins(wins => [{ win: data.win, time: Date.now() }, ...wins.slice(0, 9)]);
      if (data.bonus_triggered) {
        bonusSound.currentTime = 0;
        bonusSound.play().catch(() => {});
      }
      if (data.sticky_wilds && data.sticky_wilds.length > stickyWilds.length) {
        stickyWildSound.currentTime = 0;
        stickyWildSound.play().catch(() => {});
      }
      if (data.win > 0) {
        winSound.currentTime = 0;
        winSound.play().catch(() => {});
        if (data.win >= 100) {
          setShowBigWin(true);
          bigWinSound.currentTime = 0;
          bigWinSound.play().catch(() => {});
          setTimeout(() => setShowBigWin(false), 2500);
        }
      }
    } catch (e) {
      alert('Spin failed: ' + e);
    }
  };

  return (
  <div className="crypto-reels-slot" style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
      {/* Big Win Overlay */}
      {showBigWin && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', color: '#fff', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, fontWeight: 'bold', letterSpacing: 2
        }}>
          BIG WIN! 🎉
        </div>
      )}
      {/* Stake SDK user/wallet info */}
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        {user ? `User: ${user.username}` : 'Not authenticated'}<br/>
        {wallet ? `Balance: ${wallet.balance}` : ''}
      </div>
      <h1>Crypto Reels Slot</h1>
      {/* Slot Grid */}
  <div ref={slotGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gap: 8, justifyContent: 'center', margin: '20px 0', transition: 'transform 0.2s', transform: win > 0 ? 'scale(1.05)' : 'scale(1)' }}>
        {[0,1,2,3,4].map(reel => (
          [0,1,2].map(row => {
            const symbol = grid[reel]?.[row] || '-';
            return (
              <div key={reel + '-' + row} style={{
                width: 60,
                height: 60,
                background: symbol === 'Bitcoin' ? '#fbc531' : '#222',
                color: symbol === 'Scatter' ? '#00e1ff' : symbol === 'Bonus' ? '#ff4d4f' : '#fff',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                border: '2px solid #444',
                boxShadow: stickyWilds.some(([r, c]) => r === reel && c === row) ? '0 0 10px 2px #fbc531' : 'none',
                transition: 'background 0.2s, color 0.2s'
              }}>
                {symbolIcons[symbol] || symbol}
              </div>
            );
          })
        ))}
      </div>
      {/* Controls */}
      <div style={{ margin: '10px 0' }}>
        <label style={{ marginRight: 8 }}>Bet:</label>
        <input type="number" min={1} max={100} value={bet} onChange={e => setBet(Number(e.target.value))} style={{ width: 60, fontSize: 16, textAlign: 'center', borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }} />
  <button onClick={spinReels} style={{ padding: '10px 30px', fontSize: 18, background: '#fbc531', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 16, boxShadow: win > 0 ? '0 0 10px 2px #00ff99' : 'none', transition: 'box-shadow 0.2s' }}>Spin</button>
        <button onClick={() => setShowHelp(h => !h)} style={{ marginLeft: 8, fontSize: 16, borderRadius: 8, border: 'none', background: '#eee', cursor: 'pointer' }}>?</button>
      </div>
      {/* Recent Wins Panel */}
      <div style={{ background: '#181818', borderRadius: 8, padding: 8, margin: '10px 0', fontSize: 14, color: '#fbc531' }}>
        <b>Recent Wins:</b> {recentWins.length === 0 ? 'None yet' : recentWins.map((w, i) => <span key={i} style={{ marginRight: 8 }}>{w.win}</span>)}
      </div>
  {/* Provable Fairness Seed */}
  <div style={{ fontSize: 12, color: '#888', margin: '6px 0' }}>Provable Fairness Seed: {provableSeed}</div>
      {/* Language/Currency Selectors */}
      <div style={{ margin: '8px 0' }}>
        <select value={language} onChange={e => setLanguage(e.target.value)} style={{ marginRight: 8 }}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
        </select>
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>
      {/* Help/Tutorial Overlay */}
      {showHelp && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', color: '#fff', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, padding: 24 }}>
          <div style={{ maxWidth: 400 }}>
            <h2>How to Play</h2>
            <ul style={{ textAlign: 'left' }}>
              <li>Set your bet and press Spin.</li>
              <li>Match crypto symbols for wins.</li>
              <li>Trigger Free Spins and Bonus for big prizes.</li>
              <li>Sticky wilds appear in Free Spins.</li>
              <li>Check your recent wins and fairness seed below.</li>
            </ul>
            <button onClick={() => setShowHelp(false)} style={{ marginTop: 16, fontSize: 18, borderRadius: 8, border: 'none', background: '#fbc531', padding: '8px 24px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
      {/* Leaderboard/Achievements (scaffold) */}
      <div style={{ fontSize: 13, color: '#888', margin: '8px 0' }}>
        <b>Leaderboard:</b> Coming soon! | <b>Achievements:</b> Coming soon!
      </div>
      {/* Game Info */}
      <div style={{ margin: '10px 0', fontSize: 20, color: win > 0 ? '#00ff99' : '#fff', fontWeight: win > 0 ? 'bold' : 'normal', transition: 'color 0.2s' }}>
        Win: <b>{win}</b>
        {win > 0 && <span style={{ marginLeft: 8, fontSize: 24 }}>🎉</span>}
      </div>
      <div style={{ color: freeSpins > 0 ? '#fbc531' : '#fff' }}>Free Spins: <b>{freeSpins}</b></div>
      <div style={{ color: bonusTriggered ? '#ff4d4f' : '#fff' }}>Bonus Triggered: <b>{bonusTriggered ? 'Yes' : 'No'}</b></div>
      <div style={{ fontSize: 12, color: '#888' }}>Sticky Wilds: {JSON.stringify(stickyWilds)}</div>
    </div>
  );
}
