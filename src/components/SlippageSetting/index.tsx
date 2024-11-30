import React from "react";
import SwapSlippage from "@/components/SlippageSetting/SwapSlippage";

const SlippageSetting = () => {
  return (
    <div className="mb-6 flex flex-col">
      <label className="opacity-70 mb-[12px]">Set Slippage:</label>
      <SwapSlippage />
    </div>
  );
};

export default SlippageSetting;
