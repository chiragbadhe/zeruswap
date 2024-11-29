import { useState, useEffect } from "react";

// Define the structure of the response data from CoinGecko API
interface TokenPriceResponse {
  [key: string]: {
    usd: number;
  };
}

const CoinGeckoAPIBaseURL = "https://api.coingecko.com/api/v3";

// Custom hook to fetch the token price in USD
export const useTokenPrice = (tokenAddress: string | null) => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchPrice = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${CoinGeckoAPIBaseURL}/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
        );

        const data: TokenPriceResponse = await response.json();
        const usdPrice = data[tokenAddress.toLowerCase()]?.usd;

        if (usdPrice) {
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
    };

    fetchPrice();
  }, [tokenAddress]);

  return { price, loading, error };
};
