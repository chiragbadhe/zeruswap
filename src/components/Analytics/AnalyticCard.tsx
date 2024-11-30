import React from "react";

interface AnalyticCardProps {
  label: string;
  value: string;
  positive?: boolean;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  label,
  value,
  positive,
}) => {
  return (
    <div className="border border-white/20 p-4 rounded-lg">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          positive === true
            ? "text-green-700"
            : positive === false
            ? "text-red-700"
            : "text-gray-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AnalyticCard;
