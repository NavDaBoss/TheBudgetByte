/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/login',
            destination: '/pages/login',
          },
          {
            source: '/register',
            destination: '/pages/register',
          },
          {
            source: '/profile',
            destination: '/pages/profile',
          },
        ];
      },


};

export default nextConfig;
