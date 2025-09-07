/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverExternalPackages: ["@hashgraph/sdk", "@hashgraph/hedera-agent-kit"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@hashgraph/sdk", "@hashgraph/hedera-agent-kit");
    }
    return config;
  },
};

export default nextConfig;
