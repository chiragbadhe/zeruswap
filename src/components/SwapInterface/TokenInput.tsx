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
  isLoading?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  type,
  amount,
  setAmount,
  text,
  disabled = false,
  isLoading = false,
}) => {
  const { balance, isLoading: balanceLoading } = useBalanceByTokenType();
  const { tokenIn } = useSwapStore();
  const { price: tokenInPrice, loading: priceLoading } = useTokenPrice(
    tokenIn?.address || null
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const renderPriceImpact = () => (
    <p className="flex space-x-[4px]">
      <span>
        {priceLoading ? (
          <span className="animate-pulse bg-gray-300/30 h-6 w-20"></span>
        ) : (
          `~ ${tokenInPrice ? tokenInPrice * Number(amount) : 0}`
        )}
      </span>
      <span> USD</span>
    </p>
  );

  const renderBalance = () => (
    <div className="space-x-[4px] flex">
      <span>Balance:</span>
      <span>
        {balanceLoading ? (
          <div className="animate-pulse bg-gray-300/30 h-6 w-6"></div>
        ) : (
          balance?.formatted
        )}
      </span>
    </div>
  );

  return (
    <div className="mb-6 p-4 border border-white/20 rounded-lg">
      <div className="flex justify-between">
        <div className="flex flex-col space-y-[8px]">
          <p>{text}</p>
          {isLoading ? (
            <div className="animate-pulse bg-gray-300/30 h-6 w-20"></div>
          ) : (
            <input
              type="number"
              placeholder="0.00"
              min={0}
              value={amount}
              onChange={handleAmountChange}
              className="max-w-[155px] h-6 bg-transparent border-none outline-none text-[26px] font-bold"
              disabled={disabled}
            />
          )}
        </div>
        <TokenSelector type={type} />
      </div>
      <div className="flex justify-between mt-[12px] opacity-50">
        {renderPriceImpact()}
        {type === "in" && renderBalance()}
      </div>
    </div>
  );
};

export default TokenInput;
