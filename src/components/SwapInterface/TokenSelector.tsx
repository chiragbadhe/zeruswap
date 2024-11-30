"use client";

import React, { useState } from "react";
import { useSwapStore, Token } from "../../store/swap";
import { ChevronDown, X } from "lucide-react";
import useFetchTokens from "../../hooks/useFetchTokens";
import { motion, AnimatePresence } from "framer-motion";

interface TokenSelectorProps {
  type: "in" | "out";
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ type }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { tokens } = useFetchTokens();
  const { setTokenIn, setTokenOut, tokenIn, tokenOut } = useSwapStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleTokenSelect = (token: Token) => {
    if (type === "in") {
      setTokenIn(token);
    } else {
      setTokenOut(token);
    }
    setIsOpen(false);
  };

  const toggleSelector = () => setIsOpen((prev) => !prev);

  const selectedToken = type === "in" ? tokenIn : tokenOut;

  const filteredTokens = tokens.filter((token) =>
    [token.name, token.symbol].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <button
        onClick={toggleSelector}
        className="bg-white/5 border-white/20 border text-white px-[10px] rounded md:min-w-[120px] flex items-center"
      >
        {selectedToken ? (
          <>
            <img
              src={selectedToken.logoURI}
              alt={`${selectedToken.symbol} logo`}
              className="w-6 h-6 mr-2"
            />
            {selectedToken.symbol}
          </>
        ) : (
          <div className="flex justify-between w-full">
            <span>Select Token</span>
            <ChevronDown />
          </div>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="flex flex-col bg-[#1A1D1F]/80 mx-[12px] backdrop-blur-lg border border-white/10 rounded-lg shadow-lg max-w-md w-full max-h-[500px] p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <button
                onClick={toggleSelector}
                className="text-red-500 mb-4 absolute top-0 right-0 p-3"
              >
                <X color="#6d28d9" />
              </button>
              <div>
                <label htmlFor="token-search" className="block mb-2">
                  Search Token:
                </label>
                <input
                  id="token-search"
                  type="text"
                  placeholder="Type token name or symbol here"
                  value={search}
                  onChange={handleSearchChange}
                  className="border p-2 w-full mb-4 bg-transparent mt-[12px] outline-none border-purple-700"
                />
              </div>
              <div className="overflow-scroll relative">
                <ul>
                  {filteredTokens.map((token) => (
                    <li
                      key={token.address}
                      className="p-2 cursor-pointer hover:bg-purple-700/20 flex items-center"
                      onClick={() => handleTokenSelect(token)}
                    >
                      <img
                        src={token.logoURI}
                        alt={`${token.symbol} logo`}
                        className="w-6 h-6 mr-2"
                      />
                      {token.symbol} - {token.name}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TokenSelector;
