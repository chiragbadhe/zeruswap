// This file contains dummy data for recent trades used in the application
interface Trade {
  time: string;
  type: string; 
  amount: number; 
  price: number;
}

export const recentTrades: Trade[] = [
  {
    time: "2023-10-01T12:00:00Z",
    type: "Buy",
    amount: 1.5,
    price: 3000.0,
  },
  {
    time: "2023-10-01T12:05:00Z",
    type: "Sell",
    amount: 0.75,
    price: 3050.0,
  },
  {
    time: "2023-10-01T12:10:00Z",
    type: "Buy",
    amount: 2.0,
    price: 2900.0,
  },
  {
    time: "2023-10-01T12:15:00Z",
    type: "Sell",
    amount: 1.0,
    price: 3100.0,
  },
];

export default recentTrades;


// Dummy data for price history based on timeframe
interface PriceHistoryEntry {
  timestamp: number;
  price: number;
}

interface DummyPriceHistory {
  "24h": PriceHistoryEntry[];
  "7d": PriceHistoryEntry[];
  "30d": PriceHistoryEntry[];
}

export const dummyPriceHistory: DummyPriceHistory = {
  "24h": [
    { timestamp: 1633400000000, price: 1.5 },
    { timestamp: 1633410000000, price: 1.6 },
    { timestamp: 1633450000000, price: 1.7 },
    { timestamp: 1633430000000, price: 1.8 },
  ],
  "7d": [
    { timestamp: 1633000000000, price: 2.0 },
    { timestamp: 1633100000000, price: 2.1 },
    { timestamp: 1633200000000, price: 2.2 },
    { timestamp: 1633300000000, price: 2.3 },
  ],
  "30d": [
    { timestamp: 1631000000000, price: 3.0 },
    { timestamp: 1632000000000, price: 3.1 },
    { timestamp: 1633000000000, price: 3.2 },
    { timestamp: 1634000000000, price: 3.3 },
  ],
};

