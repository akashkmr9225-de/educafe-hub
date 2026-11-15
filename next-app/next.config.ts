import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "/educafe-hub",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;