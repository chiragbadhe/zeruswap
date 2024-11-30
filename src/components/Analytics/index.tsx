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
import { dummyPriceHistory } from "@/lib/dummyData/dummy";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [analyticsData] = await Promise.all([
          fetchTokenAnalytics(tokenA.address, tokenB.address),
        ]);

        // const [historyData] = await Promise.all([
        //   fetchTokenPriceHistory(tokenA.address, tokenB.address, timeframe),
        // ]);
        // setPriceHistory(historyData.data);

        setAnalytics(analyticsData.data);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [tokenA, tokenB, timeframe]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      className="bg-[#1A1D1F]/50 border border-white/10 rounded-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnalyticsDisplay
        analytics={analytics}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        tokenA={tokenA}
        tokenB={tokenB}
        isLoading={loading}
      />
      <AnalyticsChart priceHistory={dummyPriceHistory[timeframe]} />
      <RecentTradesTable tokenA={tokenA} tokenB={tokenB} />
    </motion.div>
  );
}
