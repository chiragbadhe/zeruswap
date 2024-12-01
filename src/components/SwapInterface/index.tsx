"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSwapStore } from "../../store/swap";
import { useAccount, useReadContract, useSendTransaction } from "wagmi";
import TokenInputWrapper from "./TokenInputWrapper";
import SlippageSetting from "../SlippageSetting";
import { parseUnits } from "viem";
import useQuote from "@/hooks/useQuote";
import { Pool, Route, SwapOptions, SwapRouter, Trade } from "@uniswap/v3-sdk";
import { CurrencyAmount, Percent, TradeType } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { UNISWAP_ROUTER_ADDRESS } from "@/lib/utils/constants";
import useGasEstimate from "@/hooks/useGasEstimate";
import { showToast } from "@/lib/utils/toast";
import TokenPairAnalytics from "../Analytics";
import DisplayData from "./DisplayData";
import useSwapData from "@/hooks/useSwapData";
import { motion } from "framer-motion";
import { useTokenTransferApproval } from "@/hooks/useTokenTransferApproval";
import SwapActionButton from "./SwapActionButton";

const SwapInterface: React.FC = () => {
  const {
    tokenIn,
    tokenOut,
    amountIn,
    priceImpact,
    setAmountIn,
    setPriceImpact,
    setRoute,
    route,
    amountOut,
    setAmountOut,
    poolAddress,
    setTransactionStatus,
    slippage,
    setTokenIn,
    setTokenOut,
  } = useSwapStore();

  const { isConnected, address } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { formattedQuote: quoteData, isLoading: isQuoteLoading } = useQuote(
    tokenIn,
    tokenOut,
    amountIn
  );

  const { data: poolSlot0 } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolABI.abi,
    functionName: "slot0",
    query: { enabled: !!poolAddress },
  });

  const { data: liquidityData } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolABI.abi,
    functionName: "liquidity",
    query: { enabled: !!poolAddress },
  });

  const showAnalytics = useMemo(
    () => !!(tokenIn && tokenOut),
    [tokenIn, tokenOut]
  );
  const swapData = useSwapData();
  const { maxFees } = useGasEstimate();

  const [isReviewing, setIsReviewing] = useState(false);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [methodParameters, setMethodParameters] = useState<ReturnType<
    typeof SwapRouter.swapCallParameters
  > | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const handleReviewSwap = useCallback(async () => {
    if (!swapData || !address) {
      showToast("error", "Please select tokens and connect wallet");
      setTransactionStatus("Please select tokens and connect wallet");
      return;
    }

    if (!slippage) {
      showToast("error", "Please select slippage");
      setTransactionStatus("Please select slippage");
      return;
    }

    const { token0, token1 } = swapData;

    try {
      setLoadingMessage("Preparing swap...");
      setTransactionStatus("Preparing swap...");
      setIsReviewing(true);

      const [sqrtPriceX96, tick] = Array.isArray(poolSlot0)
        ? poolSlot0
        : [undefined, undefined];
      if (tick === undefined) throw new Error("Invariant failed: TICK");

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
        parseUnits(amountIn, token0.decimals).toString()
      );
      const swapRoute = new Route([pool], token0, token1);

      const uncheckedTrade = Trade.createUncheckedTrade({
        route: swapRoute,
        inputAmount: tradeAmount,
        outputAmount: CurrencyAmount.fromRawAmount(token1, amountOut),
        tradeType: TradeType.EXACT_INPUT,
      });

      setPriceImpact(uncheckedTrade.priceImpact.toSignificant(4));

      const swapRouteDetails = swapRoute.pools.map((pool) => ({
        token0: pool.token0.symbol,
        token1: pool.token1.symbol,
        fee: pool.fee,
      }));
      setRoute(
        swapRouteDetails.map(
          (detail) => `${detail.token0}-${detail.token1}:${detail.fee}`
        )
      );

      const options: SwapOptions = {
        slippageTolerance: new Percent(Math.floor(slippage * 100), 10000),
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: address,
      };

      setMethodParameters(
        SwapRouter.swapCallParameters([uncheckedTrade], options)
      );
      setIsReviewComplete(true);
      setTransactionStatus("Review complete");
    } catch (error: unknown) {
      console.error("Swap Preparation Error:", error);
      showToast(
        "error",
        "Swap preparation failed: " + (error as Error).message
      );
      setTransactionStatus(
        "Swap preparation failed: " + (error as Error).message
      );
    } finally {
      setIsReviewing(false);
      setLoadingMessage(null);
    }
  }, [
    swapData,
    address,
    poolSlot0,
    liquidityData,
    amountOut,
    setTransactionStatus,
    slippage,
    setPriceImpact,
    setRoute,
    amountIn,
  ]);

  const { approveToken, isPending } = useTokenTransferApproval();

  const approveTokenTransfer = async () => {
    setLoadingMessage("Approving token...");
    return await approveToken({
      address: tokenIn?.address as `0x${string}`,
      decimals: tokenIn?.decimals as number,
    });
  };

  const handleSwap = async () => {
    if (!methodParameters) {
      showToast(
        "error",
        "Method parameters not set. Please review the swap first."
      );
      return;
    }

    try {
      const approvalSuccess = await approveTokenTransfer();
      if (!approvalSuccess) {
        showToast("error", "Token approval failed. Please try again.");
        return;
      }

      setLoadingMessage("Sending transaction...");
      await sendTransaction({
        data: methodParameters.calldata as `0x${string}`,
        to: UNISWAP_ROUTER_ADDRESS,
        value: BigInt(Math.floor(Number(methodParameters.value))),
        maxFeePerGas: BigInt(Math.floor(maxFees.maxFeePerGas)),
        maxPriorityFeePerGas: BigInt(Math.floor(maxFees.maxPriorityFeePerGas)),
      });

      showToast("success", "Swap transaction sent successfully!");
    } catch (error) {
      console.error("Transaction Error:", error);
      showToast("error", "Transaction failed: " + (error as Error).message);
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleInterchange = () => {
    if (tokenIn && tokenOut) {
      setTokenIn(tokenOut);
      setTokenOut(tokenIn);
    }
  };

  useEffect(() => {
    if (loadingMessage) {
      showToast("info", loadingMessage);
    }
  }, [loadingMessage]);

  return (
    <div className="flex-col px-[12px] md:space-x-[12px] space-x-0 flex sm:flex-row items-start justify-center py-6 container max-w-7xl mx-auto">
      <div className="mb-[50px] w-full md:w-[500px] shadow-lg rounded-lg bg-[#1A1D1F]/50 p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-left mb-6 underline decoration-purple-700 underline-offset-2 opacity-70">
          Token Swap
        </h2>

        <TokenInputWrapper
          amount={amountIn}
          amountOut={quoteData}
          isLoading={
            !!tokenIn && !!tokenOut && !!amountIn ? isQuoteLoading : false
          }
          setAmount={setAmountIn}
          setAmountOut={setAmountOut}
          handleInterchange={handleInterchange}
        />

        <SlippageSetting />

        {isReviewComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DisplayData
              text="Price Impact"
              value={priceImpact?.toString() ?? null}
            />
            <DisplayData
              text="Gas Estimation"
              value={maxFees.maxFeePerGas.toFixed(2) + " Gwei"}
            />
            <DisplayData text="Route" value={route.join(" -> ")} />
          </motion.div>
        )}

        <SwapActionButton
          isConnected={isConnected}
          isReviewComplete={isReviewComplete}
          isPending={isPending}
          isReviewing={isReviewing}
          loadingMessage={loadingMessage}
          onApprove={approveTokenTransfer}
          onSwap={handleSwap}
          onReview={handleReviewSwap}
        />
      </div>

      <div
        className={`transition-opacity duration-300 w-full md:w-auto ${
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
