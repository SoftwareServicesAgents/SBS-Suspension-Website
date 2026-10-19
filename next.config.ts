import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // All imagery is bundled in /public — no remote patterns are allowed, so the
  // built site can never reach out to an external host at runtime.
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
