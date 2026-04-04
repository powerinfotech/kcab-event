/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true }, // TODO: TS 에러 수정 후 false로 변경 (현재 35건 이상의 에러 존재)
  sassOptions: { silenceDeprecations: ['import'] },
  ...(process.env.NODE_ENV === 'development' ? {
    async rewrites() {
      const apiTarget = process.env.BACKEND_URL || 'http://localhost:8070';
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
