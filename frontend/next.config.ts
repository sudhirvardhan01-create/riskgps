import type { NextConfig } from "next";

// You can also write your own config directly:
const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Find the existing file-loader rule for SVGs
    const fileLoaderRule = config.module.rules.find(
      (rule: any) =>
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
    );

    if (fileLoaderRule && "exclude" in fileLoaderRule) {
      (fileLoaderRule.exclude as RegExp[]).push(/\.svg$/i);
    }

    // Add SVGR loader for SVGs
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
