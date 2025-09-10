
"""
Crypto Reels Slot Game Backend Logic
- 5x3 reels, 243 ways
- Free spins feature
- Bonus game feature
- Modular for Stake SDK integration
Theme: Crypto (Bitcoin, Ethereum, Dogecoin, etc.)
"""

import random
from typing import List, Dict, Any


class CryptoReelsSlot:
    REELS = 5
    ROWS = 3
    WAYS = 243
    SYMBOLS = [
        'Bitcoin', 'Ethereum', 'Dogecoin', 'Litecoin', 'Ripple',
        'Tether', 'Cardano', 'BNB', 'Scatter', 'Bonus'
    ]
    PAYTABLE = {
        'Bitcoin': [0, 0, 20, 40, 100],
        'Ethereum': [0, 0, 15, 30, 80],
        'Dogecoin': [0, 0, 12, 24, 60],
        'Litecoin': [0, 0, 10, 20, 50],
        'Ripple': [0, 0, 8, 16, 40],
        'Tether': [0, 0, 6, 12, 30],
        'Cardano': [0, 0, 5, 10, 25],
        'BNB': [0, 0, 4, 8, 20],
        'Scatter': [0, 0, 0, 0, 0],
        'Bonus': [0, 0, 0, 0, 0],
    }
    SCATTER_SYMBOL = 'Scatter'
    BONUS_SYMBOL = 'Bonus'
    FREE_SPIN_TRIGGER = 3
    BONUS_TRIGGER = 3
    FREE_SPINS_AWARDED = 10

    def __init__(self):
        self.balance = 0
        self.free_spins = 0
        self.in_bonus = False

    def spin(self, bet: int, sticky_wilds: List[tuple] = None) -> Dict[str, Any]:
        """
        Spins the reels. If in free spins, sticky wilds are used and updated.
        sticky_wilds: list of (reel, row) positions for sticky wilds.
        """
        if sticky_wilds is None:
            sticky_wilds = []
        if self.free_spins > 0:
            self.free_spins -= 1
            is_free_spin = True
        else:
            self.balance -= bet
            is_free_spin = False
        grid = self._generate_grid()
        # Add sticky wilds to grid during free spins
        if is_free_spin:
            for (reel, row) in sticky_wilds:
                grid[reel][row] = 'Bitcoin'  # Use Bitcoin as wild symbol
            # Randomly add new sticky wilds
            if random.random() < 0.3:  # 30% chance to add a new sticky wild
                new_reel = random.randint(0, self.REELS - 1)
                new_row = random.randint(0, self.ROWS - 1)
                sticky_wilds.append((new_reel, new_row))
                grid[new_reel][new_row] = 'Bitcoin'
        result = self._evaluate_grid(grid, bet)
        if result['scatters'] >= self.FREE_SPIN_TRIGGER:
            self.free_spins += self.FREE_SPINS_AWARDED
        if result['bonuses'] >= self.BONUS_TRIGGER:
            self.in_bonus = True
        return {
            'grid': grid,
            'win': result['win'],
            'free_spins': self.free_spins,
            'bonus_triggered': self.in_bonus,
            'is_free_spin': is_free_spin,
            'sticky_wilds': sticky_wilds if is_free_spin else []
        }

    def _generate_grid(self) -> List[List[str]]:
        return [[random.choice(self.SYMBOLS) for _ in range(self.ROWS)] for _ in range(self.REELS)]

    def _evaluate_grid(self, grid: List[List[str]], bet: int) -> Dict[str, Any]:
        # Simplified: count symbols for demo
        win = 0
        scatters = 0
        bonuses = 0
        for reel in grid:
            for symbol in reel:
                if symbol == self.SCATTER_SYMBOL:
                    scatters += 1
                if symbol == self.BONUS_SYMBOL:
                    bonuses += 1
        # Add win calculation logic here (ways evaluation)
        # ...
        return {'win': win, 'scatters': scatters, 'bonuses': bonuses}

    def play_bonus(self) -> dict:
        """
        Crypto Wheel Bonus: Spin a wheel with multipliers and prizes.
        Returns a dict with the prize and wheel outcome.
        """
        if not self.in_bonus:
            return {"win": 0, "outcome": None}
        wheel = [
            {"label": "2x", "multiplier": 2},
            {"label": "5x", "multiplier": 5},
            {"label": "10x", "multiplier": 10},
            {"label": "20x", "multiplier": 20},
            {"label": "50x", "multiplier": 50},
            {"label": "100x", "multiplier": 100},
            {"label": "Jackpot", "multiplier": 500},
            {"label": "Mini", "multiplier": 25},
            {"label": "Mega", "multiplier": 200},
        ]
        outcome = random.choice(wheel)
        base_prize = 10  # This could be bet or a fixed value
        win = base_prize * outcome["multiplier"]
        self.in_bonus = False
        self.balance += win
        return {"win": win, "outcome": outcome}

    def get_balance(self) -> int:
        return self.balance
