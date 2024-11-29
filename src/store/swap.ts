import { create } from "zustand";

export interface Token {
  symbol: string;
  name: string;
  address: string;
  balance: string;
}

interface SwapState {
  tokenIn: Token | null;
  tokenOut: Token | null;
  amount: string;
  slippage: number;
  gasFee: string;
  priceImpact: string;
  route: string[];
  transactionStatus: string;

  setTokenIn: (token: Token) => void;
  setTokenOut: (token: Token) => void;
  setAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setGasFee: (fee: string) => void;
  setPriceImpact: (impact: string) => void;
  setRoute: (route: string[]) => void;
  setTransactionStatus: (status: string) => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  tokenIn: null,
  tokenOut: null,
  amount: "",
  slippage: 0,
  gasFee: "",
  priceImpact: "",
  route: [],
  transactionStatus: "",

  setTokenIn: (token) => set({ tokenIn: token }),
  setTokenOut: (token) => set({ tokenOut: token }),
  setAmount: (amount) => set({ amount }),
  setSlippage: (slippage) => set({ slippage }),
  setGasFee: (fee) => set({ gasFee: fee }),
  setPriceImpact: (impact) => set({ priceImpact: impact }),
  setRoute: (route) => set({ route }),
  setTransactionStatus: (status) => set({ transactionStatus: status }),
}));
