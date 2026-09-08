import type { NextConfig } from "next";

const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  transpilePackages: ["@gr/shared-ui"],
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${backendApiUrl}/api/v1/:path*` }];
  },
};

export default nextConfig;
