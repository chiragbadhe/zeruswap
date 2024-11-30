import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils/formatting";

interface AnalyticsChartProps {
  priceHistory: { timestamp: number; price: number }[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ priceHistory }) => {
  return (
    <div className="h-80 w-full px-[12px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString()
            }
            stroke="#545759"
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#545759"
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Price"]}
            labelFormatter={(timestamp: number) =>
              new Date(timestamp).toLocaleString()
            }
            contentStyle={{
              backgroundColor: "#292D30",
              borderColor: "#333",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#6D27D9"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
