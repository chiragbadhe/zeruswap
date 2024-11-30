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
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString()
            }
            stroke="#ffffff"
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#ffffff"
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Price"]}
            labelFormatter={(timestamp: number) =>
              new Date(timestamp).toLocaleString()
            }
            contentStyle={{ backgroundColor: "#333", borderColor: "#333" }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
