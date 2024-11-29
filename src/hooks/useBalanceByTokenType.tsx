import { useSwapStore } from "@/store/swap";
import { isNativeToken } from "@/helper";
import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";

export const useBalanceByTokenType = () => {
  const { address } = useAccount();
  const { tokenIn } = useSwapStore();

  const {
    data: balance,
    isLoading,
    error,
    refetch: refetchErc20Balance,
  } = useBalance({
    address,
    token: tokenIn?.address as `0x${string}`,
  });

  const {
    data: nativeBalance,
    isLoading: isNativeBalanceLoading,
    error: nativeBalanceError,
    refetch: refetchNativeBalance,
  } = useBalance({ address });
  const result = useMemo(() => {
    if (isNativeToken(tokenIn!)) {
      return {
        balance: nativeBalance,
        isLoading: isNativeBalanceLoading,
        error: nativeBalanceError,
        refetch: refetchNativeBalance,
      };
    } else {
      return {
        balance,
        isLoading,
        error,
        refetch: refetchErc20Balance,
      };
    }
  }, [
    balance,
    error,
    isLoading,
    isNativeBalanceLoading,
    nativeBalance,
    nativeBalanceError,
    refetchErc20Balance,
    refetchNativeBalance,
    tokenIn,
  ]);

  return {
    balance: result.balance,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};
