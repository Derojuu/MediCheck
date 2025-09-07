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
  // experimental: {
  //   serverExternalPackages: ["@hashgraphonline/standards-sdk", "@hashgraph/hedera-agent-kit"],
  // },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push("@hashgraph/sdk", "@hashgraph/hedera-agent-kit");
  //   }
  //   return config;
  // },
  experimental: {
    serverComponentsExternalPackages: ["@hashgraphonline/standards-sdk"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        worker_threads: false,
      };
    }
    return config;
  },
  // Optional: Enable standalone output for better server deployment
  output: "standalone",
};

export default nextConfig;
