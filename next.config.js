
const withBundleAnalyzer = require("@next/bundle-analyzer")({
enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: false,
basePath: "/podium",
};

module.exports = withBundleAnalyzer(nextConfig);
