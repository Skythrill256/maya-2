import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["source.unsplash.com", "maya-explorer.joydeeeep.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: "https://maya-explorer.joydeeeep.com/",
      },
    ];
  },
};

export default nextConfig;
