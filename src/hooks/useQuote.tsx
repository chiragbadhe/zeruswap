import { useReadContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { Address, zeroAddress } from "viem";
import { useEffect, useState } from "react";
import { QUOTER_CONTRACT_ADDRESS } from "@/lib/utils/constants";

interface QuoteResult {
  formattedQuote: string;
  rawQuote: bigint | null;
  error: Error | null;
  isLoading: boolean;
}

const useQuote = (
  tokenInAddress: Address | undefined,
  tokenOutAddress: Address | undefined,
  amount: string
): QuoteResult => {
  // Validate inputs
  const isValidInput =
    tokenInAddress &&
    tokenOutAddress &&
    tokenInAddress !== zeroAddress &&
    tokenOutAddress !== zeroAddress &&
    parseFloat(amount) > 0;

  const {
    data: quotedAmountOut,
    error,
    isPending,
  } = useReadContract({
    address: QUOTER_CONTRACT_ADDRESS,
    abi: QuoterABI.abi,
    functionName: "quoteExactInputSingle",
    args: isValidInput
      ? [
          tokenInAddress,
          tokenOutAddress,
          3000, // Fee tier (assumes 0.3% pool)
          parseUnits(amount, 18).toString(),
          0,
        ]
      : undefined,
    query: {
      enabled: isValidInput,
    },
  });

  // State to store formatted quote
  const [formattedQuote, setFormattedQuote] = useState<string>("0");

  // Effect to handle quote formatting
  useEffect(() => {
    try {
      if (quotedAmountOut) {
        const formatted = formatUnits(BigInt(quotedAmountOut.toString()), 18);
        setFormattedQuote(formatted);
      } else {
        setFormattedQuote("0");
      }
    } catch (formatError) {
      console.error("Quote formatting error:", formatError);
      setFormattedQuote("0");
    }
  }, [quotedAmountOut]);

  // Comprehensive error handling
  const processedError = (() => {
    if (!isValidInput) {
      return new Error("Invalid input: Check token addresses and amount");
    }
    return error || null;
  })();

  return {
    formattedQuote,
    rawQuote: quotedAmountOut ? BigInt(quotedAmountOut.toString()) : null,
    error: processedError,
    isLoading: isPending,
  };
};

export default useQuote;
