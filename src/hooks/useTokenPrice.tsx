import { useState, useEffect, useCallback } from "react";

/*
  `useTokenPrice` fetches a token's USD price from CoinGecko using its address.
  Returns `price`, `loading`, and `error` states. `fetchPrice` is memoized with
  `useCallback` and runs on `tokenAddress` change via `useEffect`.
*/

interface TokenPriceResponse {
  [key: string]: {
    usd: number;
  };
}

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";

export const useTokenPrice = (tokenAddress: string | null) => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!tokenAddress) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${COINGECKO_API_BASE_URL}/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch price: ${response.statusText}`);
      }

      const data: TokenPriceResponse = await response.json();
      const usdPrice = data[tokenAddress.toLowerCase()]?.usd;

      if (usdPrice !== undefined) {
        setPrice(usdPrice);
      } else {
        setError("Price not found");
      }
    } catch (err) {
      console.error("Error fetching price:", err);
      setError("Failed to fetch price");
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { price, loading, error };
};
