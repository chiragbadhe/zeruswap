import React from "react";

interface SwapButtonProps {
  transactionStatus: string;
  isConnected: boolean;
  handleSwap: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  transactionStatus,
  isConnected,
  handleSwap,
}) => {
  return (
    <>
      {isConnected ? (
        <button
          onClick={handleSwap}
          className="w-full bg-violet-700 text-white py-3 px-4 rounded hover:bg-violet-600 transition duration-300 mt-3"
        >
          Swap
        </button>
      ) : (
        <button
          disabled
          className="w-full bg-gray-500 text-white py-3 px-4 rounded"
        >
          Please connect wallet first
        </button>
      )}

      {transactionStatus && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {transactionStatus}
        </p>
      )}
    </>
  );
};

export default SwapButton;
