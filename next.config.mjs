/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Produces an 'out' folder for iOS/Android builds
  images: { unoptimized: true },
};

export default nextConfig;