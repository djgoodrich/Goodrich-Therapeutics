/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The site has two root layouts (homepage + classic pages), so the 404 lives in app/global-not-found.js
    globalNotFound: true,
  },
};

export default nextConfig;
