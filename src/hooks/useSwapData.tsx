// src/hooks/useSwapData.ts
import { useMemo } from "react";
import { useSwapStore } from "@/store/swap";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";

const useSwapData = () => {
  const { tokenIn, tokenOut, amountIn, setPoolAddress } = useSwapStore();

  const swapData = useMemo(() => {
    if (tokenIn && tokenOut && amountIn) {
      const token0 = new Token(
        tokenIn.chainId,
        tokenIn.address as `0x${string}`,
        tokenIn.decimals,
        tokenIn.symbol,
        tokenIn.name
      );

      const token1 = new Token(
        tokenIn.chainId,
        tokenOut.address as `0x${string}`,
        tokenOut.decimals,
        tokenOut.symbol,
        tokenOut.name
      );

      const poolAddress = Pool.getAddress(token0, token1, 3000);
      setPoolAddress(poolAddress);

      return { token0, token1, poolAddress };
    }
    return null;
  }, [tokenIn, tokenOut, amountIn, setPoolAddress]);

  return swapData;
};

export default useSwapData;
