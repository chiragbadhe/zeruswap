import React from "react";
import { Token } from "@/store/swap";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatting";
import AnalyticCard from "../Analytics/AnalyticCard";

interface AnalyticsDisplayProps {
  analytics: {
    price: number;
    volume24h: number;
    liquidityDepth: number;
    priceChange24h: number;
  } | null;
  timeframe: "24h" | "7d" | "30d";
  setTimeframe: (timeframe: "24h" | "7d" | "30d") => void;
  tokenA: Token;
  tokenB: Token;
}

const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({
  analytics,
  timeframe,
  setTimeframe,
  tokenA,
  tokenB,
}) => {
  return (
    <div className="flex flex-col justify-between items-center p-6">
      <div className="flex justify-between w-full mb-[12px]">
        <h2 className="text-xl font-bold text-white opacity-70 underline underline-offset-2 decoration-purple-700">
          {tokenA.symbol}/{tokenB.symbol} Analytics
        </h2>
        <div className="flex space-x-2">
          {(["24h", "7d", "30d"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded ${
                timeframe === period
                  ? "bg-violet-700 text-white"
                  : "text-gray-300"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
          <AnalyticCard
            label="Current Price"
            value={formatCurrency(analytics.price)}
          />
          <AnalyticCard
            label="24h Volume"
            value={formatCurrency(analytics.volume24h)}
          />
          <AnalyticCard
            label="Liquidity Depth"
            value={formatCurrency(analytics.liquidityDepth)}
          />
          <AnalyticCard
            label="24h Price Change"
            value={formatPercentage(analytics.priceChange24h)}
            positive={analytics.priceChange24h >= 0}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsDisplay;
