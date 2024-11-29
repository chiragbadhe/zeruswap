"use client";

import React from "react";
import { useSwapStore } from "../store/swap";
import TokenSelector from "./TokenSelector";
import TokenInput from "./TokenInput";
import { ArrowDownUp } from "lucide-react";
import { useBalanceByTokenType } from "@/hooks/useBalanceByTokenType";
import SwapSlippage from "./SlippageCustom";

const SwapInterface: React.FC = () => {
  const {
    tokenIn,
    tokenOut,
    amount,
    slippage,
    priceImpact,
    transactionStatus,
    setAmount,
    setSlippage,
    setTransactionStatus,
    setTokenIn,
    setTokenOut,
  } = useSwapStore();

  const { balance, isLoading } = useBalanceByTokenType();

  const handleSwap = () => {
    if (!tokenIn || !tokenOut || !amount) {
      setTransactionStatus("Please fill in all fields");
      return;
    }
    setTransactionStatus("Swapping...");
    setTimeout(() => {
      setTransactionStatus("Swap successful!");
    }, 2000);
  };

  const handleInterchange = () => {
    console.log(tokenIn, tokenOut);
    if (tokenOut) {
      setTokenIn(tokenOut);
    }
    if (tokenIn) {
      setTokenOut(tokenIn);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-[12px] md:mx-auto mb-[50px] shadow-lg rounded-lg bg-[#1A1D1F]/50 mt-[24px] border border-white/10">
      <h2 className="text-2xl font-semibold text-left mb-6 underline decoration-purple-700 underline-offset-2 opacity-70">
        Token Swap
      </h2>
      <div className="relative">
        <TokenInput
          type="in"
          amount={amount}
          setAmount={(value) => setAmount(value.toString())}
          text="Pay"
        />

        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
          <button
            className="text-white p-3 hover:bg-violet-600 border border-white/20 bg-[#111315] transition duration-300 rounded-full"
            onClick={handleInterchange}
          >
            <ArrowDownUp />
          </button>
        </div>

        <TokenInput
          type="out"
          amount={amount}
          setAmount={(value) => setAmount(value.toString())}
          text="Receive"
        />
      </div>

      <div className="mb-6 flex flex-col">
        <label className="opacity-70 mb-[12px]">Set Slippage:</label>
        <SwapSlippage />
      </div>

      <div className="mb-6">
        <p className="opacity-60 justify-between flex">
          Price Impact:
          <span className="font-medium">{priceImpact || "Loading..."}</span>
        </p>
      </div>

      <div className="mb-6">
        <p className="opacity-60 justify-between flex">
          Estimated Gas Fee:
          <span className="font-medium">{"Gas Fee"}</span>
        </p>
      </div>

      <div className="mb-6">
        <p className="opacity-60 justify-between flex">
          Route:
          <span className="font-medium">{"Route"}</span>
        </p>
      </div>

      <button
        onClick={handleSwap}
        className="w-full bg-violet-700 text-white py-3 px-4 rounded hover:bg-violet-600 transition duration-300"
      >
        Swap
      </button>
      {transactionStatus && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {transactionStatus}
        </p>
      )}
    </div>
  );
};

export default SwapInterface;
