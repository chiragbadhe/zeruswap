import { useReadContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { useMemo } from "react";
import { QUOTER_CONTRACT_ADDRESS } from "@/lib/utils/constants";
import { Token } from "@/store/swap";
import { showToast } from "@/lib/utils/toast"; // Import showToast function

interface QuoteResult {
  formattedQuote: string;
  rawQuote: bigint | null;
  error: Error | null;
  isLoading: boolean;
}

const useQuote = (
  tokenIn: Token | null,
  tokenOut: Token | null,
  amount: string,
  feeTier: number = 3000 // Default to 0.3% pool
): QuoteResult => {
  const isValidInput = useMemo(() => {
    return (
      tokenIn &&
      tokenOut &&
      tokenIn.address !== "0x0000000000000000000000000000000000000000" &&
      tokenOut.address !== "0x0000000000000000000000000000000000000000" &&
      parseFloat(amount) > 0 &&
      tokenIn.decimals !== undefined &&
      tokenOut.decimals !== undefined
    );
  }, [tokenIn, tokenOut, amount]);

  const parsedAmount = useMemo(() => {
    if (!isValidInput) return undefined;
    try {
      return parseUnits(amount, tokenIn!.decimals).toString();
    } catch (error) {
      console.error("Amount parsing error:", error);
      showToast("error", "Parsing error");
      return undefined;
    }
  }, [amount, tokenIn, isValidInput]);

  const {
    data: quotedAmountOut,
    error: contractError,
    isPending,
  } = useReadContract(
    isValidInput
      ? {
          address: QUOTER_CONTRACT_ADDRESS,
          abi: QuoterABI.abi,
          functionName: "quoteExactInputSingle",
          args: [
            tokenIn!.address as `0x${string}`,
            tokenOut!.address as `0x${string}`,
            feeTier,
            parsedAmount!,
            0,
          ],
          query: {
            enabled: true,
            retry: 2,
            retryDelay: 1000,
          },
        }
      : { query: { enabled: false } }
  );

  const [formattedQuote, processedError] = useMemo(() => {
    if (contractError) {
      const errorMessage = contractError.message.toLowerCase();
      if (errorMessage.includes("revert")) {
        if (errorMessage.includes("insufficient liquidity")) {
          const error = new Error("Insufficient liquidity");
          showToast("error", error.message);
          return ["0", error];
        }
        if (errorMessage.includes("no pools")) {
          const error = new Error("No pools found");
          showToast("error", error.message);
          return ["0", error];
        }
        const error = new Error("Quote call failed");
        showToast("error", error.message);
        return ["0", error];
      }
      showToast("error", contractError.message);
      return ["0", contractError];
    }

    try {
      if (quotedAmountOut && isValidInput) {
        const formatted = formatUnits(
          BigInt(quotedAmountOut.toString()),
          tokenOut!.decimals
        );
        return [formatted, null];
      }
      return ["0", null];
    } catch (formatError) {
      console.error("Quote formatting error:", formatError);
      showToast("error", "Formatting error");
      return ["0", new Error("Failed to format quote")];
    }
  }, [quotedAmountOut, tokenOut, isValidInput, contractError]);

  return {
    formattedQuote,
    rawQuote: quotedAmountOut ? BigInt(quotedAmountOut.toString()) : null,
    error: processedError,
    isLoading: isPending,
  };
};

export default useQuote;
