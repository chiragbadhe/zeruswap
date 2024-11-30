import { useState, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { Address, parseGwei } from "viem";

interface GasEstimateResult {
  gasEstimate: bigint | null;
  estimateGasCost: (params: {
    to: Address;
    data: `0x${string}`;
    value?: bigint;
    maxFeePerGas: bigint;
  }) => Promise<void>;
  error: string | null;
}

export const useGasEstimate = (): GasEstimateResult => {
  const publicClient = usePublicClient();
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const estimateGasCost = useCallback(
    async ({
      to,
      data,
      value = BigInt(0),
      maxFeePerGas,
    }: {
      to: Address;
      data: `0x${string}`;
      value?: bigint;
      maxFeePerGas: bigint;
    }) => {
      if (!publicClient) {
        setError("No public client available");
        return;
      }

      try {
        setError(null);
        const gasEstimateRaw = await publicClient.estimateGas({
          to,
          data,
          value,
        });

        const gasCost = gasEstimateRaw * maxFeePerGas;

        setGasEstimate(gasCost);
      } catch (err: unknown) {
        console.error("Gas Estimation Error:", err);
        setError(err instanceof Error ? err.message : "Failed to estimate gas");
        setGasEstimate(null);
      }
    },
    [publicClient]
  );

  return { gasEstimate, estimateGasCost, error };
};
