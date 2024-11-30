import { useSwapStore } from "@/store/swap";
import { isNativeToken } from "@/lib/utils/isNativeToken";
import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";

/*
  `useBalanceByTokenType` is a custom hook that determines the balance of a token
  based on its type (native or ERC20). It uses the `useAccount` hook to get the
  user's address and the `useSwapStore` to retrieve the token information.
  Depending on whether the token is native or ERC20, it fetches the balance using
  the `useBalance` hook from `wagmi`. The result is memoized for performance
  optimization and returned with loading and error states.
*/

export const useBalanceByTokenType = () => {
  const { address } = useAccount();
  const { tokenIn } = useSwapStore();

  const erc20Balance = useBalance({
    address,
    token: tokenIn?.address as `0x${string}`,
  });

  const nativeTokenBalance = useBalance({ address });

  const result = useMemo(() => {
    const isNative = isNativeToken(tokenIn!);
    return isNative ? nativeTokenBalance : erc20Balance;
  }, [erc20Balance, nativeTokenBalance, tokenIn]);

  return {
    balance: result.data,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};
