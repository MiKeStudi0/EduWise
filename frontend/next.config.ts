import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 🔑 REQUIRED for static export

  images: {
    unoptimized: true, // 🔑 REQUIRED for static hosting
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
