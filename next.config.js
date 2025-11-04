const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // basePath: "/podium",  <-- hapus baris ini bro!
};

module.exports = withBundleAnalyzer(nextConfig);
