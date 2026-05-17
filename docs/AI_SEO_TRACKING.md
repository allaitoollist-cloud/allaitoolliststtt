# AI Traffic Tracking Guide (GA4)

To track AI-driven referral traffic (from ChatGPT, Gemini, Perplexity, etc.) in Google Analytics 4, follow these steps:

## 1. Navigate to GA4 Reports
Go to **Reports** > **Acquisition** > **Traffic Acquisition**.

## 2. Add Comparison
Click **Add comparison** at the top of the report.

## 3. Set Filter Dimensions
- **Dimension**: Session source / medium
- **Match Type**: matches regex
- **Value**: Use the Regular Expression below

## 4. The "Big Ass" Regular Expression
Copy and paste this regex into the Value field:

```regex
(chatgpt|openai|perplexity|bing|anthropic|claude|gemini|google-ai-overview|bard|pi\.ai|you\.com|huggingface|mistral|consensus|overviews\.google\.com)
```

## Why Track This?
As SEO shifts toward **Generative Engine Optimization (GEO)** and **Answer Engine Optimization (AEO)**, traditional organic traffic stats won't show the full picture. This comparison allows you to see:
- Which AI platforms are citing your content.
- Which specific pages are being used as primary sources for LLM retrieval.
- The growth rate of your "Architecture of Intent" strategy.

---
*Strategy based on the 2026 AI-SEO Framework.*
