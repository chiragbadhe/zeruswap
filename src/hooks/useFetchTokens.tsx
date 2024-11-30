import { useState, useEffect, useCallback } from "react";
import { Token } from "../store/swap";
import { useChainId } from "wagmi";

/*
  `useFetchTokens` is a custom hook that fetches a list of tokens from a specified API.
  It filters the tokens based on a target chain ID and stores them in the state.
  The hook returns the filtered list of tokens.
*/

interface TokenData {
  tokens: Token[];
}

const TOKEN_API_URL = "https://tokens.uniswap.org";

const useFetchTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const TARGET_CHAIN_ID = useChainId();

  const fetchTokens = useCallback(async () => {
    try {
      const response = await fetch(TOKEN_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch tokens: ${response.statusText}`);
      }
      const data: TokenData = await response.json();
      const filteredTokens = data.tokens.filter(
        (token) => token.chainId === TARGET_CHAIN_ID
      );
      setTokens(filteredTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }, [TARGET_CHAIN_ID]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens };
};

export default useFetchTokens;
