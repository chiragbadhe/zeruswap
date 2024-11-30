import React from "react";

interface PriceImpactDisplayProps {
  priceImpact: string | null;
}

const PriceImpactDisplay: React.FC<PriceImpactDisplayProps> = ({
  priceImpact,
}) => {
  return (
    <div className="mb-6">
      <p className="opacity-60 justify-between flex">
        Price Impact:
        <span className="font-medium">{priceImpact || "Loading..."}</span>
      </p>
    </div>
  );
};

export default PriceImpactDisplay;
