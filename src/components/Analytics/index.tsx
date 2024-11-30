"use client";

import React, { useState, useEffect } from "react";
import { Token } from "@/store/swap";
import {
  fetchTokenPriceHistory,
  fetchTokenAnalytics,
} from "@/lib/services/analytics";
import AnalyticsDisplay from "../Analytics/AnalyticsDisplay";
import AnalyticsChart from "../Analytics/AnalyticsChart";
import RecentTradesTable from "../Analytics/RecentTradesTable";

interface TokenPairAnalyticsProps {
  tokenA: Token;
  tokenB: Token;
}

interface PriceHistoryData {
  timestamp: number;
  price: number;
}

interface TokenAnalytics {
  price: number;
  volume24h: number;
  liquidityDepth: number;
  priceChange24h: number;
}

export default function TokenPairAnalytics({
  tokenA,
  tokenB,
}: TokenPairAnalyticsProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const [analytics, setAnalytics] = useState<TokenAnalytics | null>(null);
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [historyData, analyticsData] = await Promise.all([
          fetchTokenPriceHistory(tokenA.address, tokenB.address, timeframe),
          fetchTokenAnalytics(tokenA.address, tokenB.address),
        ]);

        setPriceHistory(historyData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      }
    }

    loadAnalytics();
  }, [tokenA, tokenB, timeframe]);
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-[#1A1D1F]/50 border border-white/10 rounded-lg">
      <AnalyticsDisplay
        analytics={analytics}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        tokenA={tokenA}
        tokenB={tokenB}
      />
      <AnalyticsChart priceHistory={priceHistory} />
      <RecentTradesTable tokenA={tokenA} tokenB={tokenB} />
    </div>
  );
}
