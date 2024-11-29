"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSwapStore, Token } from "../store/swap";
import { X } from "lucide-react";

function TokenSelector({ type }: { type: "in" | "out" }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const { setTokenIn, setTokenOut, tokenIn, tokenOut } = useSwapStore();

  const fetchTokens = useCallback(async () => {
    try {
      const response = await fetch("https://tokens.uniswap.org");
      const data = await response.json();
      // Filter tokens for chainId 1 only
      const filteredTokens = data.tokens.filter(
        (token: any) => token.chainId === 1
      );
      setTokens(filteredTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const selectToken = (token: Token) => {
    if (type === "in") {
      setTokenIn(token);
    } else {
      setTokenOut(token);
    }
    setIsOpen(false);
  };

  const toggleSelector = () => setIsOpen((prev) => !prev);

  const selectedTokenSymbol =
    type === "in" ? tokenIn?.symbol : tokenOut?.symbol;

  return (
    <>
      <button
        onClick={toggleSelector}
        className="bg-white/5  border-white/20 border text-white p-2 rounded w-1/2"
      >
        {selectedTokenSymbol || "Select Token"}
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="flex flex-col bg-[#1A1D1F]/80  mx-[12px] backdrop-blur-lg border border-white/10 rounded-lg shadow-lg max-w-md w-full max-h-[500px] p-6">
            <div>
              <button
                onClick={toggleSelector}
                className="text-red-500 mb-4 absolute top-0 right-0 p-3"
              >
                <X color="#6d28d9" />
              </button>
              <div>
                <span>Search Token :</span>
                <input
                  type="text"
                  placeholder="type token name or symbol here"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 w-full mb-4 bg-transparent mt-[12px] outline-none border-purple-700"
                />
              </div>
            </div>
            <div className="overflow-scroll relative">
              <ul>
                {filteredTokens.map((token) => (
                  <li
                    key={token.address}
                    className="p-2 cursor-pointer hover:bg-purple-700/20"
                    onClick={() => selectToken(token)}
                  >
                    {token.symbol} - {token.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TokenSelector;
