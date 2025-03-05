/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  reactStrictMode: false,
  compiler: {
    styledComponents: {
      ssr: true,         // ✅ Ensures Styled Components work with SSR
      displayName: true, // ✅ Helps debug class names
      fileName: false,   // ✅ Prevents styles from breaking on hot reload
      minify: false,     // ✅ Prevents class name mismatches on updates
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig; // ✅ Correct ESM syntax for Next.js
