import React from "react";
import TokenSelector from "./TokenSelector";
import { useBalanceByTokenType } from "@/hooks/useBalanceByTokenType";

interface TokenInputProps {
  type: "in" | "out";
  amount: string;
  setAmount: (value: number) => void;
  text: string;
}

function TokenInput({ type, amount, setAmount, text }: TokenInputProps) {
  const { balance, isLoading } = useBalanceByTokenType();

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
          />
        </div>
        <TokenSelector type={type} />
      </div>

      <div className="flex justify-between mt-[12px] opacity-50">
        <span>~ 0.00 USD</span>
        {type === "in" && (
          <div>Balance: {isLoading ? balance?.formatted : "0"}</div>
        )}
      </div>
    </div>
  );
}

export default TokenInput;
