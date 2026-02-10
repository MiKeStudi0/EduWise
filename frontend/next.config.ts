import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ REQUIRED for static site
  output: "export",

  // ❌ Turbopack root is NOT needed for static builds on Render
  // turbopack: {
  //   root: __dirname,
  // },

  // ✅ Needed so images work in static export
  images: {
    unoptimized: true, // IMPORTANT for static hosting
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.google.com" }
    ],
  },
};

export default nextConfig;
