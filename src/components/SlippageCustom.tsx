import { FC, useState } from "react";
import { useSwapStore } from "@/store/swap";

interface PredefinedOptionProps {
  percentage: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const PredefinedOption: FC<PredefinedOptionProps> = ({
  percentage,
  isSelected,
  onClick,
}) => {
  return (
    <div>
      <div
        className={` px-[16px] py-[12px] text-center shadow ${
          isSelected ? "border-white/20 rounded-md border" : ""
        }`}
        onClick={onClick}
      >
        {percentage} %
      </div>
    </div>
  );
};

const SwapSlippage = () => {
  const { slippage, setSlippage } = useSwapStore();
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const setSlippageValue = (value: number) => {
    setIsCustomSelected(false);
    setSlippage(value);
  };

  const handleButtonClick = (value: number) => {
    setSlippageValue(value);
  };

  return (
    <section className="space-y-[12px]">
      <div className="grid grid-cols-4 gap-[12px] justify-betweentext-[13px] md:text-[16px]">
        <div className="w-full cursor-pointer ">
          <PredefinedOption
            percentage={0.1}
            isSelected={slippage === 0.1}
            onClick={() => handleButtonClick(0.1)}
          />
        </div>

        <div className="w-full cursor-pointer ">
          <PredefinedOption
            percentage={0.5}
            isSelected={slippage === 0.5}
            onClick={() => handleButtonClick(0.5)}
          />
        </div>

        <div className="w-full cursor-pointer ">
          <PredefinedOption
            percentage={1}
            isSelected={slippage === 1}
            onClick={() => handleButtonClick(1)}
          />
        </div>

        <div
          className={`text w-full cursor-pointer px-[16px] py-[12px] text-center  ${
            isCustomSelected ? "rounded-md border-white/20 border " : ""
          }`}
          onClick={() => {
            setIsCustomSelected(true);
            setSlippage(0);
          }}
        >
          Custom
        </div>
      </div>

      <div className="flex w-full">
        <div className=" flex w-full  border border-white/20  ">
          <input
            type="number"
            value={slippage.toString()}
            className={`${
              !isCustomSelected ? "cursor-not-allowed" : "cursor-text"
            } w-full  bg-transparent px-[12px]  focus:outline-none`}
            onChange={(event) => {
              setIsCustomSelected(true);
              setSlippage(Number(event.target.value));
            }}
            placeholder="0.0"
            min={0}
          />
          <span className="w-[69px] border-l border-white/20 px-[16px] py-[13px] text-center ">
            %
          </span>
        </div>
      </div>
    </section>
  );
};

export default SwapSlippage;
