import { useEstimateFeesPerGas } from "wagmi";
import { useState, useEffect } from "react";

const useMaxFees = () => {
  const [maxFees, setMaxFees] = useState({
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
  });

  const result = useEstimateFeesPerGas({
    chainId: 1,
  });

  useEffect(() => {
    if (result.data) {
      setMaxFees({
        maxFeePerGas: result.data.maxFeePerGas || BigInt(0),
        maxPriorityFeePerGas: result.data.maxPriorityFeePerGas || BigInt(0),
      });
    }
  }, [result.data]);

  return maxFees;
};

export default useMaxFees;
