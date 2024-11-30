import React from "react";
import TokenInput from "./TokenInput";
import { ArrowDownUp } from "lucide-react";
import { useAccount } from "wagmi";

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

  const { isConnected } = useAccount();

  return (
    <div className="relative">
      <TokenInput
        type="in"
        amount={amount}
        setAmount={handleSetAmount(setAmount)}
        text="Pay"
        disabled={!isConnected}
      />

      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4 top-1/2">
        <button
          className="text-white p-4 hover:bg-violet-600 border border-white/20 bg-[#111315] transition duration-300 rounded-full"
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
