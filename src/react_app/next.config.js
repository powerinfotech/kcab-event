/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  sassOptions: { silenceDeprecations: ['import'] },
  ...(process.env.NODE_ENV === 'development' ? {
    async rewrites() {
      const apiTarget = process.env.BACKEND_URL || 'http://localhost:8080';
      return [
        { source: '/api/:path*', destination: `${apiTarget}/api/:path*` },
      ];
    },
  } : {}),
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;
