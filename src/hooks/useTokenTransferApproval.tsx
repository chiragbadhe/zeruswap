import { UNISWAP_ROUTER_ADDRESS } from "@/lib/utils/constants";
import { Address, parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useSwapStore } from "@/store/swap";

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

  const { amount } = useSwapStore();

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
  const SWAP_ROUTER_ADDRESS = UNISWAP_ROUTER_ADDRESS; // Your swap router address
  const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = amount; // Example amount

  const handleApprove = async (token: Token): Promise<TransactionState> => {
    try {
      // Parse the amount to the token's decimals
      const approveAmount = parseUnits(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER.toString(),
        token.decimals
      );

      // Trigger the approval transaction
      const hash = writeContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [SWAP_ROUTER_ADDRESS, approveAmount],
        gas: BigInt(12),
      });

      // Wait for transaction confirmation
      const receipt = useWaitForTransactionReceipt({
        hash: hash as unknown as `0x${string}`,
      });

      // Determine transaction state based on receipt
      return receipt.status === "success"
        ? TransactionState.Success
        : TransactionState.Failed;
    } catch (error) {
      console.error("Approval Error:", error);
      return TransactionState.Failed;
    }
  };

  return {
    approveToken: handleApprove,
    isPending,
    isSuccess,
    isError,
  };
}
