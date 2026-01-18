"""
Bing Webmaster API - URL Indexing Script
Automatically submit URLs from allaitoollist.com for indexing
"""

import requests
import json
import time
from datetime import datetime
import xml.etree.ElementTree as ET
from bing_config import API_KEY, SITE_URL, SITEMAP_URL, BATCH_SIZE, DELAY_BETWEEN_URLS, DELAY_BETWEEN_BATCHES

# Bing Webmaster API endpoints
BASE_URL = "https://ssl.bing.com/webmaster/api.svc"

class BingWebmasterAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = BASE_URL
        
    def _make_request(self, endpoint, method="POST", data=None):
        """Make API request to Bing Webmaster"""
        url = f"{self.base_url}/{endpoint}?apikey={self.api_key}"
        
        headers = {
            'Content-Type': 'application/json; charset=utf-8'
        }
        
        try:
            if method == "POST":
                response = requests.post(url, json=data, headers=headers)
            else:
                response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json() if response.text else None}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def submit_url(self, site_url, url):
        """Submit a single URL for indexing"""
        data = {
            "siteUrl": site_url,
            "url": url
        }
        return self._make_request("SubmitUrl", data=data)
    
    def submit_url_batch(self, site_url, url_list):
        """Submit multiple URLs for indexing"""
        data = {
            "siteUrl": site_url,
            "urlList": url_list
        }
        return self._make_request("SubmitUrlBatch", data=data)
    
    def get_crawl_stats(self, site_url):
        """Get crawl statistics"""
        data = {"siteUrl": site_url}
        return self._make_request("GetCrawlStats", data=data)
    
    def get_url_info(self, site_url, url):
        """Get information about a specific URL"""
        data = {
            "siteUrl": site_url,
            "url": url
        }
        return self._make_request("GetUrlInfo", data=data)

def fetch_sitemap_urls(sitemap_url):
    """Fetch all URLs from sitemap.xml"""
    try:
        response = requests.get(sitemap_url)
        if response.status_code != 200:
            print(f"❌ Failed to fetch sitemap: HTTP {response.status_code}")
            return []
        
        # Parse XML
        root = ET.fromstring(response.content)
        
        # Handle namespace
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        urls = []
        for url in root.findall('.//ns:url/ns:loc', namespace):
            urls.append(url.text)
        
        return urls
    except Exception as e:
        print(f"❌ Error fetching sitemap: {e}")
        return []

def submit_urls_for_indexing(api_key, site_url, urls):
    """Submit URLs for indexing with rate limiting"""
    api = BingWebmasterAPI(api_key)
    
    total_urls = len(urls)
    successful = 0
    failed = 0
    
    print(f"\n{'='*60}")
    print(f"🚀 Starting URL Submission for {site_url}")
    print(f"{'='*60}")
    print(f"📊 Total URLs to submit: {total_urls}\n")
    
    # Process in batches
    for i in range(0, total_urls, BATCH_SIZE):
        batch = urls[i:i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1
        total_batches = (total_urls + BATCH_SIZE - 1) // BATCH_SIZE
        
        print(f"\n📦 Batch {batch_num}/{total_batches} ({len(batch)} URLs)")
        print("-" * 60)
        
        for url in batch:
            print(f"📤 Submitting: {url}")
            result = api.submit_url(site_url, url)
            
            if result["success"]:
                print(f"   ✅ Success")
                successful += 1
            else:
                print(f"   ❌ Failed: {result.get('error', 'Unknown error')}")
                failed += 1
            
            # Rate limiting - wait between requests
            time.sleep(DELAY_BETWEEN_URLS)
        
        # Wait between batches
        if i + BATCH_SIZE < total_urls:
            print(f"\n⏳ Waiting {DELAY_BETWEEN_BATCHES} seconds before next batch...")
            time.sleep(DELAY_BETWEEN_BATCHES)
    
    # Summary
    print(f"\n{'='*60}")
    print(f"📊 INDEXING SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Successful: {successful}/{total_urls}")
    print(f"❌ Failed: {failed}/{total_urls}")
    print(f"📈 Success Rate: {(successful/total_urls*100):.1f}%")
    print(f"{'='*60}\n")
    
    return {
        "total": total_urls,
        "successful": successful,
        "failed": failed
    }

def main():
    """Main execution function"""
    print(f"""
╔══════════════════════════════════════════════════════════╗
║     BING WEBMASTER API - URL INDEXING TOOL              ║
║     Website: {SITE_URL:<40} ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    # Check if API key is set
    if API_KEY == "YOUR_API_KEY_HERE":
        print("❌ ERROR: Please set your Bing Webmaster API key in the script!")
        print("   Edit the API_KEY variable at the top of this file.\n")
        return
    
    # Fetch URLs from sitemap
    print("🔍 Fetching URLs from sitemap...")
    urls = fetch_sitemap_urls(SITEMAP_URL)
    
    if not urls:
        print("❌ No URLs found in sitemap. Using default URLs...")
        urls = [
            SITE_URL,
            f"{SITE_URL}categories",
            f"{SITE_URL}blog",
            f"{SITE_URL}about",
        ]
    else:
        print(f"✅ Found {len(urls)} URLs in sitemap\n")
    
    # Display URLs to be submitted
    print("\n📋 URLs to be submitted:")
    for i, url in enumerate(urls[:10], 1):
        print(f"   {i}. {url}")
    if len(urls) > 10:
        print(f"   ... and {len(urls) - 10} more URLs")
    
    # Confirm submission
    print(f"\n⚠️  Ready to submit {len(urls)} URLs for indexing")
    confirm = input("Continue? (yes/no): ").strip().lower()
    
    if confirm not in ['yes', 'y']:
        print("❌ Indexing cancelled by user.")
        return
    
    # Submit URLs
    results = submit_urls_for_indexing(API_KEY, SITE_URL, urls)
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"indexing_results_{timestamp}.json"
    
    with open(results_file, 'w') as f:
        json.dump({
            "timestamp": timestamp,
            "site_url": SITE_URL,
            "results": results,
            "urls": urls
        }, f, indent=2)
    
    print(f"💾 Results saved to: {results_file}")

if __name__ == "__main__":
    main()
