/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/login',
          destination: '/components/login',
        },
        {
          source: '/register',
          destination: '/components/register',
        },
        {
          source: '/profile',
          destination: '/components/profile',
        },
        {
            source: '/dashboard',
            destination: '/components/dashboard',
        },
        {
            source: '/receipts',
            destination: '/components/receipts',
        },
        {
            source: '/ocr',
            destination: '/components/ocr',
        },


      ];
    },
  };

export default nextConfig;
