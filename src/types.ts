export type ActivePair = "BTC/USD" | "BTC/USDT" | "USD/LKR";

export interface TickerData {
  prices: {
    "BTC/USD": number;
    "BTC/USDT": number;
    "USD/LKR": number;
    "BTC/LKR": number;
  };
  stats24h: {
    changePercent: number;
    high: number;
    low: number;
    volume: number;
  };
}

export interface PredictionItem {
  day: number;
  date: string;
  predictedClose: number;
  high: number;
  low: number;
  confidence: number;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
  sentiment: "bullish" | "bearish" | "neutral";
}

export interface HistoryItem {
  id: number;
  date: string;
  timeRange: string;
  minVal: number;
  maxVal: number;
  isFuture: boolean;
}

export interface PortfolioAsset {
  symbol: "BTC" | "USD" | "USDT" | "LKR";
  amount: number;
}
