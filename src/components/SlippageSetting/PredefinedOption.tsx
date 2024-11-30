import { FC } from "react";

interface PredefinedOptionProps {
  percentage: number;
  isSelected: boolean;
  onClick: () => void;
}

const PredefinedOption: FC<PredefinedOptionProps> = ({
  percentage,
  isSelected,
  onClick,
}) => (
  <div
    className={`px-[16px] py-[12px] text-center shadow cursor-pointer ${
      isSelected ? "border-white/20 rounded-md border" : ""
    }`}
    onClick={onClick}
  >
    {percentage} %
  </div>
);

export default PredefinedOption;
