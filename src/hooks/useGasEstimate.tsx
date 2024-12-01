import { useEstimateFeesPerGas, useEstimateGas } from "wagmi";
import { useState, useEffect } from "react";
import { UNISWAP_ROUTER_ADDRESS } from "@/lib/utils/constants";
import { useAccount } from "wagmi";
import { useSwapStore } from "@/store/swap";
import { parseEther, formatUnits } from "viem";

interface MaxFees {
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
}

const useGasEstimate = () => {
  const [maxFees, setMaxFees] = useState<MaxFees>({
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
  });

  const { address, chainId: currentChainId } = useAccount();
  const { amountIn } = useSwapStore();

  const feesResult = useEstimateFeesPerGas({
    chainId: currentChainId,
  });

  const gasEstimate = useEstimateGas({
    account: address,
    to: UNISWAP_ROUTER_ADDRESS,
    value: amountIn ? parseEther(amountIn.toString()) : undefined,
  });

  useEffect(() => {
    if (feesResult.data && !!address && !!amountIn) {
      // Convert bigint to number in Gwei for readability
      setMaxFees({
        maxFeePerGas: Number(formatUnits(feesResult.data.maxFeePerGas, 9)),
        maxPriorityFeePerGas: Number(
          formatUnits(feesResult.data.maxPriorityFeePerGas, 9)
        ),
      });
    }
  }, [feesResult.data, address, amountIn]);

  // Calculate total gas cost estimate
  const estimatedGasCost = gasEstimate.data
    ? Number(
        formatUnits(
          gasEstimate.data * BigInt(maxFees.maxFeePerGas * 10 ** 9),
          18
        )
      )
    : null;

  return {
    maxFees: {
      maxFeePerGas: maxFees.maxFeePerGas,
      maxPriorityFeePerGas: maxFees.maxPriorityFeePerGas,
    },
    gasEstimate: {
      units: gasEstimate.data ? Number(gasEstimate.data) : null,
      estimatedCost: estimatedGasCost, // Estimated cost in ETH
    },
    isLoading: feesResult.isLoading || gasEstimate.isLoading,
    isError: !!feesResult.error || !!gasEstimate.error,
    error: feesResult.error || gasEstimate.error,
  };
};

export default useGasEstimate;
