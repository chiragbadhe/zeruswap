import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const UNISWAP_SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export async function fetchTokenPriceHistory(
  tokenAAddress: string,
  tokenBAddress: string,
  timeframe: "24h" | "7d" | "30d"
) {
  let isLoading = true;
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${tokenAAddress}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: timeframe === "24h" ? 1 : timeframe === "7d" ? 7 : 30,
        },
      }
    );
    isLoading = false;
    return {
      data: response.data.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        })
      ),
      error: null,
      isLoading,
    };
  } catch (error) {
    console.error("Failed to fetch price history", error);
    isLoading = false;
    return { data: [], error: error as Error, isLoading };
  }
}

export async function fetchTokenAnalytics(
  tokenAAddress: string,
  tokenBAddress: string
) {
  let isLoading = true;
  try {
    const [priceData, volumeData, liquidityData] = await Promise.all([
      fetchTokenPrice(tokenAAddress),
      fetchTokenVolume(tokenAAddress, tokenBAddress),
      fetchLiquidityDepth(tokenAAddress, tokenBAddress),
    ]);
    isLoading = false;
    return {
      data: {
        price: priceData.data.price,
        volume24h: volumeData.data.volume,
        liquidityDepth: liquidityData.data.depth,
        priceChange24h: priceData.data.priceChange24h,
      },
      error: null,
      isLoading,
    };
  } catch (error) {
    console.error("Failed to fetch token analytics", error);
    isLoading = false;
    return { data: null, error: error as Error, isLoading };
  }
}

async function fetchTokenPrice(tokenAddress: string) {
  let isLoading = true;
  try {
    const response = await axios.get(
      `${COINGECKO_API}/simple/token_price/ethereum`,
      {
        params: {
          contract_addresses: tokenAddress,
          vs_currencies: "usd",
          include_24hr_change: true,
        },
      }
    );
    isLoading = false;
    const tokenData = response.data[tokenAddress.toLowerCase()];
    return {
      data: {
        price: tokenData.usd,
        priceChange24h: tokenData.usd_24h_change,
      },
      error: null,
      isLoading,
    };
  } catch (error) {
    console.error("Failed to fetch token price", error);
    isLoading = false;
    return {
      data: { price: 0, priceChange24h: 0 },
      error: error as Error,
      isLoading,
    };
  }
}

async function fetchTokenVolume(tokenAAddress: string, tokenBAddress: string) {
  let isLoading = true;
  try {
    const response = await axios.post(UNISWAP_SUBGRAPH, {
      query: `
        query {
          pool(id: "${tokenAAddress}-${tokenBAddress}") {
            volumeUSD
          }
        }
      `,
    });
    isLoading = false;
    return {
      data: { volume: response.data.data.pool.volumeUSD },
      error: null,
      isLoading,
    };
  } catch (error) {
    console.error("Failed to fetch token volume", error);
    isLoading = false;
    return { data: { volume: 0 }, error: error as Error, isLoading };
  }
}

async function fetchLiquidityDepth(
  tokenAAddress: string,
  tokenBAddress: string
) {
  let isLoading = true;
  try {
    const response = await axios.post(UNISWAP_SUBGRAPH, {
      query: `
        query {
          pool(id: "${tokenAAddress}-${tokenBAddress}") {
            totalValueLockedUSD
          }
        }
      `,
    });
    isLoading = false;
    return {
      data: { depth: response.data.data.pool.totalValueLockedUSD },
      error: null,
      isLoading,
    };
  } catch (error) {
    console.error("Failed to fetch liquidity depth", error);
    isLoading = false;
    return { data: { depth: 0 }, error: error as Error, isLoading };
  }
}

interface Trade {
  time: number;
  type: string;
  amount: number;
  price: number;
}

export async function fetchRecentTrades(
  tokenAAddress: string,
  tokenBAddress: string
): Promise<{ data: Trade[]; error: Error | null; isLoading: boolean }> {
  let isLoading = true;
  try {
    const response = await axios.post(UNISWAP_SUBGRAPH, {
      query: `
        query {
          trades(first: 10, orderBy: timestamp, orderDirection: desc, where: {tokenA: "${tokenAAddress}", tokenB: "${tokenBAddress}"}) {
            time: timestamp
            type: tradeType
            amount: amountUSD
            price: priceUSD
          }
        }
      `,
    });
    isLoading = false;
    return {
      data: response.data.data.trades.map((trade: Trade) => ({
        time: trade.time,
        type: trade.type,
        amount: trade.amount,
        price: trade.price,
      })),
      error: null,
      isLoading,
    };
  } catch (error) {
    console.error("Failed to fetch recent trades", error);
    isLoading = false;
    return { data: [], error: error as Error, isLoading };
  }
}
