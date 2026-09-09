import type { NextConfig } from "next";
import { env } from "./config/env";

const nextConfig: NextConfig = {
  transpilePackages: ["@gr/shared-ui"],
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${env.backendApiUrl}/api/v1/:path*` }];
  },
};

export default nextConfig;
