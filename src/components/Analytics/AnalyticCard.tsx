import React from "react";

interface AnalyticCardProps {
  label: string;
  value: string;
  positive?: boolean;
  isLoading: boolean;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  label,
  value,
  positive,
  isLoading,
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
        {isLoading ? (
          <div className="animate-pulse bg-gray-300/30 h-6 w-20"></div>
        ) : (
          value
        )}
      </p>
    </div>
  );
};

export default AnalyticCard;
