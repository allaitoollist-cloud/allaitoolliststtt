# AI Log Analysis Protocol (Matt Diggity Method)

Use this protocol to identify which of your pages are being ignored by AI bots and how to fix retrieval issues.

## 1. Locate Server Log Files
Access your hosting control panel (cPanel, Vercel, or custom server) and download your **Access Logs** (usually named `access.log` or located in a `/logs` folder).

## 2. ChatGPT Analysis Prompt
Upload your log file to ChatGPT and use the following prompt:

```text
I've attached log files from my website server. Please analyze the logs focusing on Googlebot and AI crawlers such as:
- GPTBot (ChatGPT)
- Google-InspectionTool / Googlebot
- Claude-Web (Anthropic)
- PerplexityBot
- OAI-SearchBot

Tasks:
1. Identify all hits from these user agents.
2. Provide a list of the 10 pages that receive the FEWEST hits from AI bots and Google. Create a visual diagram of this "Neglected Content".
3. Provide a list of the 10 pages that receive the MOST hits (AI High-Intent pages).
4. Highlight any crawl errors (4xx or 5xx status codes) specifically for these bots.
5. Provide additional insights: are bots missing key commercial/tool pages? Are they wasting crawl budget on low-value pages?
```

## 3. The "Crawl Bridge" Fix
If an important tool or blog page is being ignored:
1. Identify a "High-Intent" page (one that bots visit frequently).
2. Add a direct, contextual **Internal Link** from that high-traffic page to the ignored page.
3. Ensure the anchor text is descriptive and aligns with the **Architecture of Intent**.

## 4. Crawl Optimization
- **Block Waste**: If bots are crawling `/account` or `/search` results, block them in `robots.txt` to save budget for tool pages.
- **Speed Check**: If log analysis shows high latency (slow response times) for bots, optimize the specific page components immediately.

## 5. Frequency
Run this audit **once a month** to track your "AI Referral Health" and detect sudden spikes or drops in AI crawl activity.
