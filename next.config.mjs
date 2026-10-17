/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.CF_PAGES === '1' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
