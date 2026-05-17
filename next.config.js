/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true,
  },
  images: { unoptimized: true },

  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              '</.well-known/api-catalog>; rel="api-catalog"',
              '</.well-known/agent-card.json>; rel="https://a2a-protocol.org/agent-card"',
              '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
              '</.well-known/agent-skills/index.json>; rel="agent-skills"',
              '</api/markdown>; rel="alternate"; type="text/markdown"',
            ].join(', '),
          },
        ],
      },
      {
        source: '/.well-known/api-catalog',
        headers: [
          { key: 'Content-Type', value: 'application/linkset+json; charset=utf-8' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
