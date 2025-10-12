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
  serverExternalPackages: [
    "@hashgraphonline/standards-sdk",
    "onnxruntime-node",
    'pino', 
    'pino-pretty',
    'puppeteer'  // Add puppeteer here
  ],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        worker_threads: false,
      };
      
      // Add puppeteer to externals
      config.externals = [...config.externals, 'puppeteer'];
    }

    return config;
  },

  // Optional: Enable standalone output for better server deployment
  output: "standalone",
};

export default nextConfig;
