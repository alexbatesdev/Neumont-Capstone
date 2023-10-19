/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // GPT generated config
  async headers() {
    return [
      {
        // Apply these headers to only the /demo route.
        source: '/editor',
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
        // Apply these headers to the index route.
        source: '/',
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
