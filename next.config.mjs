/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: '/api/scrape/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;