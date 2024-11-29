import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReownContext from "@/context";
import { headers } from "next/headers";

const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.ttf",
  variable: "--font-clash-display",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZeruSwap",
  description:
    "Zeruswap - A modern, user-friendly DeFi token swap interface leveraging Uniswap V3. Seamlessly connect wallets, swap tokens, and access real-time analytics with intuitive design and robust functionality.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");

  return (
    <html lang="en">
      <body className={`${clashDisplay.variable} antialiased`}>
        <ReownContext cookies={cookies}>{children}</ReownContext>
      </body>
    </html>
  );
}
