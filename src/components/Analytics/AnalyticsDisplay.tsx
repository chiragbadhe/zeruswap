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
  isLoading: boolean;
}

const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({
  analytics,
  timeframe,
  setTimeframe,
  tokenA,
  tokenB,
  isLoading,
}) => {
  return (
    <div className="flex flex-col justify-between items-center p-6">
      <div className="flex flex-col sm:flex-row justify-between w-full mb-[12px]">
        <h2 className="text-xl font-bold text-white opacity-70 underline underline-offset-2 decoration-purple-700">
          {tokenA.symbol}/{tokenB.symbol} Analytics
        </h2>
        <div className="flex space-x-2 my-4 sm:my-0 w-full md:w-auto ">
          {(["24h", "7d", "30d"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 w-full rounded border border-white/20 ${
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
        <AnalyticCard
          isLoading={isLoading}
          label="Current Price"
          value={formatCurrency(analytics?.price || 0.0)}
        />
        <AnalyticCard
          isLoading={isLoading}
          label="24h Volume"
          value={formatCurrency(analytics?.volume24h || 0.0)}
        />
        <AnalyticCard
          isLoading={isLoading}
          label="Liquidity Depth"
          value={formatCurrency(analytics?.liquidityDepth || 0.0)}
        />
        <AnalyticCard
          isLoading={isLoading}
          label="24h Price Change"
          value={formatPercentage(analytics?.priceChange24h || 0.0)}
          positive={
            analytics?.priceChange24h !== undefined &&
            analytics.priceChange24h >= 0
          }
        />
      </div>
    </div>
  );
};

export default AnalyticsDisplay;
