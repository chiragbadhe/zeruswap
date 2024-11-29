import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };

    config.externals.push({
      lokijs: "commonjs lokijs",
      "@metamask/sdk": "commonjs @metamask/sdk",
    });

    return config;
  },
  transpilePackages: [
    "@metamask/sdk",
    "@wagmi/connectors",
    "@reown/appkit-adapter-wagmi",
  ],
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
