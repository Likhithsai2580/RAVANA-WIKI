/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static export mode for GitHub Pages
  output: 'export',
  // Optional: Change the output directory `out` to something else
  distDir: 'dist',
};

module.exports = nextConfig;