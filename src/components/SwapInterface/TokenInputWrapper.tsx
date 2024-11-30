import React from "react";
import TokenInput from "./TokenInput";
import { ArrowDownUp } from "lucide-react";

interface TokenInputWrapperProps {
  amount: string;
  amountOut: string;
  setAmount: (value: string) => void;
  setAmountOut: (value: string) => void;
  handleInterchange: () => void;
  isLoading: boolean;
}

const TokenInputWrapper: React.FC<TokenInputWrapperProps> = ({
  amount,
  amountOut,
  setAmount,
  setAmountOut,
  handleInterchange,
  isLoading,
}) => {
  const handleSetAmount =
    (setter: (value: string) => void) => (value: number) => {
      setter(value.toString());
    };

  return (
    <div className="relative">
      <TokenInput
        type="in"
        amount={amount}
        setAmount={handleSetAmount(setAmount)}
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
        amount={amountOut}
        isLoading={isLoading} 
        setAmount={handleSetAmount(setAmountOut)}
        text="Receive"
        disabled
      />
    </div>
  );
};

export default TokenInputWrapper;
