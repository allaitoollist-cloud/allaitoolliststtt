import { NextResponse } from 'next/server';

export async function GET() {
  const markdown = `# All AI Tool List

> The most comprehensive directory of AI tools. Find, compare, and master the best AI software.

**URL**: https://allaitoollist.com
**Type**: AI Tools Directory
**Content**: AI software reviews, comparisons, and discovery

---

## What We Offer

- **10,000+ AI Tools** — Browse the largest collection of AI tools
- **Categories** — Tools organized by use case, industry, and type
- **Comparisons** — Side-by-side tool comparisons with feature breakdowns
- **Reviews** — User ratings and expert reviews
- **Alternatives** — Find alternatives to any AI tool

## Browse

- All Tools: https://allaitoollist.com/tools
- Categories: https://allaitoollist.com/category
- Blog: https://allaitoollist.com/blog
- Submit a Tool: https://allaitoollist.com/submit

## API

- Tools API: https://allaitoollist.com/api/tools
- API Catalog: https://allaitoollist.com/.well-known/api-catalog

## Agent Discovery

- Agent Card: https://allaitoollist.com/.well-known/agent-card.json
- MCP Server Card: https://allaitoollist.com/.well-known/mcp/server-card.json
- Agent Skills: https://allaitoollist.com/.well-known/agent-skills/index.json
`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
