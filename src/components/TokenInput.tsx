import React from "react";
import TokenSelector from "./TokenSelector";
import { useBalanceByTokenType } from "@/hooks/useBalanceByTokenType";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useSwapStore } from "@/store/swap";

interface TokenInputProps {
  type: "in" | "out";
  amount: string;
  setAmount: (value: number) => void;
  text: string;
  disabled?: boolean;
}

function TokenInput({
  type,
  amount,
  setAmount,
  text,
  disabled = false,
}: TokenInputProps) {
  const { balance, isLoading } = useBalanceByTokenType();

  const { tokenIn } = useSwapStore();

  const {
    price: tokenInPrice,
    loading,
  } = useTokenPrice(tokenIn?.address || null);

  return (
    <div className="mb-6 p-4 border border-white/20 rounded-lg">
      <div className="flex justify-between">
        <div className="flex flex-col space-y-[8px]">
          <p>{text}</p>
          <input
            type="number"
            placeholder="0.00"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-6 bg-transparent border-none outline-none text-[26px] font-bold"
            disabled={disabled} // Apply the disabled prop to the input
          />
        </div>
        <TokenSelector type={type} />
      </div>
      <div className="flex justify-between mt-[12px] opacity-50">
        <p className="flex space-x-[4px]">
          <span>
            {loading ? (
              <div className="animate-pulse bg-gray-300/30 h-6 w-20 "></div>
            ) : (
              `~ ${tokenInPrice ? tokenInPrice * Number(amount) : 0}`
            )}
          </span>
          <span> USD</span>
        </p>
        {type === "in" && (
          <div className="space-x-[4px] flex">
            <span>Balance:</span>
            <span>
              {isLoading ? (
                <div className="animate-pulse bg-gray-300/30 h-6 w-6 "></div>
              ) : (
                `${balance?.formatted}`
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenInput;
