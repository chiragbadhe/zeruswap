import { UNISWAP_ROUTER_ADDRESS } from "@/lib/utils/constants";
import { Address, parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useSwapStore } from "@/store/swap";
import { useState } from "react";

export enum TransactionState {
  Idle = "Idle",
  Pending = "Pending",
  Success = "Success",
  Failed = "Failed",
}

interface Token {
  address: Address;
  decimals: number;
}

export function useTokenTransferApproval() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { amountIn } = useSwapStore();

  const ERC20_ABI = [
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      type: "function",
    },
  ];

  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const receipt = useWaitForTransactionReceipt({ hash: transactionHash as unknown as `0x${string}` });

  const handleApprove = async (token: Token): Promise<TransactionState> => {
    try {
      const approveAmount = parseUnits(amountIn.toString(), token.decimals);
      const hash = writeContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [UNISWAP_ROUTER_ADDRESS, approveAmount],
        gas: BigInt(12),
      });

      setTransactionHash(hash as unknown as string);
      return TransactionState.Pending;
    } catch (error) {
      console.error("Approval Error:", error);
      return TransactionState.Failed;
    }
  };

  const transactionState = receipt?.status === "success"
    ? TransactionState.Success
    : receipt?.status === "error"
    ? TransactionState.Failed
    : TransactionState.Pending;

  return {
    approveToken: handleApprove,
    isPending,
    isSuccess,
    isError,
    transactionState,
  };
}
