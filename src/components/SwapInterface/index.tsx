"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSwapStore } from "../../store/swap";
import { useAccount, useReadContract, useSendTransaction } from "wagmi";
import TokenInputWrapper from "./TokenInputWrapper";
import SlippageSetting from "../SlippageSetting";
import SwapButton from "./SwapButton";
import PriceImpactDisplay from "./PriceImpactDisplay";
import { parseUnits } from "viem";
import useQuote from "@/hooks/useQuote";
import { Pool, Route, SwapOptions, SwapRouter, Trade } from "@uniswap/v3-sdk";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { UNISWAP_ROUTER_ADDRESS } from "@/lib/utils/constants";
import useGasFee from "@/hooks/useGasFee";
import { showToast } from "@/lib/utils/toast";
import TokenPairAnalytics from "../Analytics";

const SwapInterface: React.FC = () => {
  const {
    tokenIn,
    tokenOut,
    amount,
    priceImpact,
    transactionStatus,
    setAmount,
    setTransactionStatus,
    slippage,
    setTokenIn,
    setTokenOut,
  } = useSwapStore();

  const [amountOut, setAmountOut] = useState<string>("");
  const { isConnected, address } = useAccount();
  const [poolAddress, setPoolAddress] = useState<string>("");

  const { maxFeePerGas, maxPriorityFeePerGas } = useGasFee();
  const { sendTransaction } = useSendTransaction();

  const { formattedQuote: quoteData, isLoading: isQuoteLoading } = useQuote(
    tokenIn?.address as `0x${string}`,
    tokenOut?.address as `0x${string}`,
    amount
  );

  const { data: poolSlot0 } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolABI.abi,
    functionName: "slot0",
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: liquidityData } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolABI.abi,
    functionName: "liquidity",
    query: {
      enabled: !!poolAddress,
    },
  });

  const showAnalytics = useMemo(
    () => !!(tokenIn && tokenOut),
    [tokenIn, tokenOut]
  );

  const handleSwap = useCallback(async () => {
    if (!tokenIn || !tokenOut || !address || !amount) {
      showToast("error", "Please select tokens and connect wallet");
      return;
    }

    try {
      setTransactionStatus("Preparing swap...");

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

      const [sqrtPriceX96, tick] = Array.isArray(poolSlot0)
        ? poolSlot0
        : [undefined, undefined];
      const pool = new Pool(
        token0,
        token1,
        3000,
        sqrtPriceX96?.toString() || "0",
        liquidityData?.toString() || "0",
        tick
      );

      const tradeAmount = CurrencyAmount.fromRawAmount(
        token0,
        parseUnits(amount, token0.decimals).toString()
      );

      const swapRoute = new Route([pool], token0, token1);

      const uncheckedTrade = Trade.createUncheckedTrade({
        route: swapRoute,
        inputAmount: tradeAmount,
        outputAmount: CurrencyAmount.fromRawAmount(token1, amountOut),
        tradeType: TradeType.EXACT_INPUT,
      });

      const options: SwapOptions = {
        slippageTolerance: new Percent(Math.floor(slippage * 100)),
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: address,
      };

      const methodParameters = SwapRouter.swapCallParameters(
        [uncheckedTrade],
        options
      );

      sendTransaction({
        data: methodParameters.calldata as `0x${string}`,
        to: UNISWAP_ROUTER_ADDRESS,
        value: BigInt(methodParameters.value),
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
      });
    } catch (error: unknown) {
      console.error("Swap Preparation Error:", error);
      showToast("error", "Swap failed: " + (error as Error).message);
      setTransactionStatus("Swap failed");
    }
  }, [
    tokenIn,
    tokenOut,
    address,
    amount,
    poolSlot0,
    liquidityData,
    amountOut,
    maxFeePerGas,
    maxPriorityFeePerGas,
    sendTransaction,
    setTransactionStatus,
    slippage,
  ]);

  const handleInterchange = () => {
    if (tokenIn && tokenOut) {
      setTokenIn(tokenOut);
      setTokenOut(tokenIn);
    }
  };

  return (
    <div className="flex-col flex sm:flex-row items-start justify-center p-6">
      <div className="md:mx-[12px] mb-[50px] shadow-lg rounded-lg bg-[#1A1D1F]/50 p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-left mb-6 underline decoration-purple-700 underline-offset-2 opacity-70">
          Token Swap
        </h2>

        <TokenInputWrapper
          amount={amount}
          amountOut={quoteData}
          isLoading={isQuoteLoading}
          setAmount={setAmount}
          setAmountOut={setAmountOut}
          handleInterchange={handleInterchange}
        />

        <SlippageSetting />
        <PriceImpactDisplay priceImpact={priceImpact} />
        <SwapButton
          transactionStatus={transactionStatus}
          isConnected={isConnected}
          handleSwap={handleSwap}
        />
      </div>
      <div
        className={`transition-opacity duration-300 ${
          showAnalytics ? "opacity-100" : "opacity-0"
        }`}
      >
        {tokenIn && tokenOut && (
          <TokenPairAnalytics tokenA={tokenIn} tokenB={tokenOut} />
        )}
      </div>
    </div>
  );
};

export default SwapInterface;