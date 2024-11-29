import { Token } from "@/store/swap";

export const isNativeToken = (token: Token): boolean => {
  return (
    token?.address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  );
};
