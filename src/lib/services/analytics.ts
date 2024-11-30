// src/lib/services/analytics.ts
import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const UNISWAP_SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export async function fetchTokenPriceHistory(
  tokenAAddress: string,
  tokenBAddress: string,
  timeframe: "24h" | "7d" | "30d"
) {
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

    return response.data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    console.error("Failed to fetch price history", error);
    return [];
  }
}

export async function fetchTokenAnalytics(
  tokenAAddress: string,
  tokenBAddress: string
) {
  try {
    const [priceData, volumeData, liquidityData] = await Promise.all([
      fetchTokenPrice(tokenAAddress),
      fetchTokenVolume(tokenAAddress, tokenBAddress),
      fetchLiquidityDepth(tokenAAddress, tokenBAddress),
    ]);

    return {
      price: priceData.price,
      volume24h: volumeData.volume,
      liquidityDepth: liquidityData.depth,
      priceChange24h: priceData.priceChange24h,
    };
  } catch (error) {
    console.error("Failed to fetch token analytics", error);
    throw error;
  }
}

async function fetchTokenPrice(tokenAddress: string) {
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

    const tokenData = response.data[tokenAddress.toLowerCase()];
    return {
      price: tokenData.usd,
      priceChange24h: tokenData.usd_24h_change,
    };
  } catch (error) {
    console.error("Failed to fetch token price", error);
    return { price: 0, priceChange24h: 0 };
  }
}

async function fetchTokenVolume(tokenAAddress: string, tokenBAddress: string) {
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

    return {
      volume: response.data.data.pool.volumeUSD,
    };
  } catch (error) {
    console.error("Failed to fetch token volume", error);
    return { volume: 0 };
  }
}

async function fetchLiquidityDepth(
  tokenAAddress: string,
  tokenBAddress: string
) {
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

    return {
      depth: response.data.data.pool.totalValueLockedUSD,
    };
  } catch (error) {
    console.error("Failed to fetch liquidity depth", error);
    return { depth: 0 };
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
): Promise<Trade[]> {
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

    return response.data.data.trades.map((trade: Trade) => ({
      time: trade.time,
      type: trade.type,
      amount: trade.amount,
      price: trade.price,
    }));
  } catch (error) {
    console.error("Failed to fetch recent trades", error);
    return [];
  }
}
