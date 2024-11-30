"use client";
import { FC, useState, ChangeEvent } from "react";
import { useSwapStore } from "@/store/swap";
import PredefinedOption from "@/components/SlippageSetting/PredefinedOption";

const predefinedSlippageOptions = [0.1, 0.5, 1];

const SwapSlippage: FC = () => {
  const { slippage, setSlippage } = useSwapStore();
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const selectPredefinedOption = (value: number) => {
    setIsCustomSelected(false);
    setSlippage(value);
  };

  const selectCustomOption = () => {
    setIsCustomSelected(true);
  };

  const updateSlippage = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCustomSelected(true);
    setSlippage(Number(event.target.value));
  };

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-4 gap-3 text-sm md:text-base">
        {predefinedSlippageOptions.map((value) => (
          <PredefinedOption
            key={value}
            percentage={value}
            isSelected={!isCustomSelected && slippage === value}
            onClick={() => selectPredefinedOption(value)}
          />
        ))}
        <div
          className={`text-center px-4 py-3 cursor-pointer ${
            isCustomSelected ? "rounded-md border-white/20 border" : ""
          }`}
          onClick={selectCustomOption}
        >
          Custom
        </div>
      </div>

      <div className="flex w-full border border-white/20">
        <input
          type="number"
          value={slippage.toString()}
          className={`w-full bg-transparent px-3 focus:outline-none ${
            !isCustomSelected ? "cursor-not-allowed" : "cursor-text"
          }`}
          onChange={updateSlippage}
          placeholder="0.0"
          min={0}
          disabled={!isCustomSelected}
        />
        <span className="w-16 border-l border-white/20 px-4 py-3 text-center">
          %
        </span>
      </div>
    </section>
  );
};

export default SwapSlippage;
