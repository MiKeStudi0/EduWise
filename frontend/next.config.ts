import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ REQUIRED for Render Static Site

  images: {
    unoptimized: true, // ✅ REQUIRED for static export
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
