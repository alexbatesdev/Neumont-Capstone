/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // GPT generated config, me modified
  async headers() {
    return [
      {
        // Apply these headers to any children of the editor route
        source: '/editor/:path*', // :path* is a wildcard
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // Apply these headers to the dashboard route.
        source: '/dashboard',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      }
    ];
  },
  // GPT generated config
}

module.exports = nextConfig
