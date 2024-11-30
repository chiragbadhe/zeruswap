import React, { useState, useEffect } from "react";
import { Token } from "@/store/swap";
// import { fetchRecentTrades } from "@/lib/services/analytics";
import { recentTrades } from "@/lib/dummyData/dummy";

interface RecentTradesTableProps {
  tokenA: Token;
  tokenB: Token;
}

interface Trade {
  time: string;
  type: string;
  amount: number;
  price: number;
}

const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  tokenA,
  tokenB,
}) => {
  /*
    The following code has been commented out because Uniswap has deprecated this API.
    now using dummy data for recent trades.

    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
      async function getRecentTrades() {
        try {
          const recentTrades = await fetchRecentTrades(
            tokenA.address,
            tokenB.address
          );
          setTrades(recentTrades as unknown as Trade[]);
        } catch (error) {
          console.error("Error fetching recent trades:", error);
        }
      }
      getRecentTrades();
    }, [tokenA, tokenB]);
  */

  const trades = recentTrades;
  return (
    <div className="px-6 mt-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Recent Trades</h3>
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="bg-white/5 border border-white/10">
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-right">Amount</th>
            <th className="p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {trades.length > 0 ? (
            trades.map((trade, index) => (
              <tr key={index}>
                <td className="p-2">{trade.time}</td>
                <td className="p-2">{trade.type}</td>
                <td className="p-2 text-right">{trade.amount}</td>
                <td className="p-2 text-right">{trade.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-400">
                No recent trades
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTradesTable;
