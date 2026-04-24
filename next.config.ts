import type { NextConfig } from "next";

const basePath = process.env.DEPLOY_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
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
