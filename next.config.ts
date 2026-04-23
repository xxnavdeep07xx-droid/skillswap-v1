import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/skillswap-v1",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
