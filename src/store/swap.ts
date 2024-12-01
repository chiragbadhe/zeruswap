import { create } from "zustand";

export interface Token {
  chainId: number;
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  logoURI: string;
}

interface SwapState {
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountIn: string;
  amountOut: string;
  slippage: number;
  gasFee: string;
  priceImpact: string;
  route: string[];
  transactionStatus: string;
  poolAddress: string;

  setTokenIn: (token: Token) => void;
  setTokenOut: (token: Token) => void;
  setAmountIn: (amountIn: string) => void;
  setAmountOut: (amountout: string) => void;

  setSlippage: (slippage: number) => void;
  setGasFee: (fee: string) => void;
  setPriceImpact: (impact: string) => void;
  setRoute: (route: string[]) => void;
  setTransactionStatus: (status: string) => void;
  setPoolAddress: (address: string) => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  tokenIn: null,
  tokenOut: null,
  amountIn: "",
  amountOut: "",
  slippage: 0,
  gasFee: "",
  priceImpact: "",
  route: [],
  transactionStatus: "",
  poolAddress: "",

  setTokenIn: (token) => set({ tokenIn: token }),
  setTokenOut: (token) => set({ tokenOut: token }),
  setAmountIn: (amountIn) => set({ amountIn }),
  setAmountOut: (amountOut) => set({ amountOut }),
  setSlippage: (slippage) => set({ slippage }),
  setGasFee: (gasFee) => set({ gasFee }),
  setPriceImpact: (priceImpact) => set({ priceImpact }),
  setRoute: (route) => set({ route }),
  setTransactionStatus: (transactionStatus) => set({ transactionStatus }),
  setPoolAddress: (poolAddress) => set({ poolAddress }),
}));
