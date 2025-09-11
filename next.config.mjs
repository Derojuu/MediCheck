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
  // Moved from experimental to top-level config
  serverExternalPackages: ["@hashgraphonline/standards-sdk"],
  experimental: {
    // Keep this empty or remove it if you don't have other experimental features
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
