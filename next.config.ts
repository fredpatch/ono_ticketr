import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "utfs.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        hostname: "api.dicebear.com",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
