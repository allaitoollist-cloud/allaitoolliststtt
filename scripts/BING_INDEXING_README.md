# Bing Webmaster API - URL Indexing

## Quick Setup

1. **Install Requirements**:
```bash
pip install requests
```

2. **Set Your API Key**:
Edit `bing_indexing.py` and replace `YOUR_API_KEY_HERE` with your actual Bing Webmaster API key.

3. **Run the Script**:
```bash
python scripts/bing_indexing.py
```

## What This Script Does

✅ Automatically fetches all URLs from your sitemap.xml
✅ Submits each URL to Bing for indexing
✅ Shows real-time progress with status updates
✅ Handles rate limiting (0.5s between URLs, 2s between batches)
✅ Saves detailed results to JSON file
✅ Provides success/failure summary

## Usage

The script will:
1. Fetch URLs from https://allaitoollist.com/sitemap.xml
2. Display all URLs to be submitted
3. Ask for confirmation
4. Submit URLs in batches of 10
5. Show progress for each URL
6. Save results to `indexing_results_TIMESTAMP.json`

## Example Output

```
╔══════════════════════════════════════════════════════════╗
║     BING WEBMASTER API - URL INDEXING TOOL              ║
║     Website: https://allaitoollist.com/                 ║
╚══════════════════════════════════════════════════════════╝

🔍 Fetching URLs from sitemap...
✅ Found 150 URLs in sitemap

📋 URLs to be submitted:
   1. https://allaitoollist.com/
   2. https://allaitoollist.com/categories
   ... and 148 more URLs

⚠️  Ready to submit 150 URLs for indexing
Continue? (yes/no): yes

============================================================
🚀 Starting URL Submission for https://allaitoollist.com/
============================================================
📊 Total URLs to submit: 150

📦 Batch 1/15 (10 URLs)
------------------------------------------------------------
📤 Submitting: https://allaitoollist.com/
   ✅ Success
📤 Submitting: https://allaitoollist.com/categories
   ✅ Success
...

============================================================
📊 INDEXING SUMMARY
============================================================
✅ Successful: 148/150
❌ Failed: 2/150
📈 Success Rate: 98.7%
============================================================

💾 Results saved to: indexing_results_20260118_214500.json
```

## API Key Setup

If you don't have an API key yet:

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with your Microsoft account
3. Add and verify your website
4. Go to Settings → API Access
5. Generate your API key
6. Copy and paste it in the script

## Troubleshooting

**Error: "Invalid API Key"**
- Verify your API key is correct
- Make sure your site is verified in Bing Webmaster Tools

**Error: "Site not found"**
- Add your site in Bing Webmaster Tools first
- Verify ownership using one of the verification methods

**URLs not being indexed**
- Wait 24-48 hours for Bing to process the submission
- Check Bing Webmaster Tools for crawl status
- Ensure URLs are accessible (not blocked by robots.txt)
