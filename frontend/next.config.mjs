/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    NETWORK: process.env.NETWORK,
    THIRDWEB_SECRET: process.env.THIRDWEB_SECRET,
    NMKR_CUSTOMER_ID: process.env.NMKR_CUSTOMER_ID,
    NMKR_API_KEY: process.env.NMKR_API_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
  },
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
