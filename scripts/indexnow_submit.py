"""
IndexNow API - Universal URL Indexing
Submit URLs to Bing, Google, and other search engines using IndexNow protocol
"""

import requests
import json
from datetime import datetime
from bing_config import SITE_URL, SITEMAP_URL
import xml.etree.ElementTree as ET

# IndexNow API Configuration
INDEXNOW_API_URL = "https://api.indexnow.org/indexnow"

# Your IndexNow API Key (can be same as Bing API key or generate new one)
INDEXNOW_KEY = "2661c0ebbc9a41aa9d4fb88b34a41e36"

def fetch_sitemap_urls(sitemap_url):
    """Fetch all URLs from sitemap.xml"""
    try:
        response = requests.get(sitemap_url)
        if response.status_code != 200:
            print(f"[ERROR] Failed to fetch sitemap: HTTP {response.status_code}")
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
        print(f"[ERROR] Error fetching sitemap: {e}")
        return []

def submit_to_indexnow(urls, host, key):
    """Submit URLs to IndexNow API"""
    
    # IndexNow accepts max 10,000 URLs per request
    batch_size = 10000
    
    for i in range(0, len(urls), batch_size):
        batch = urls[i:i + batch_size]
        
        payload = {
            "host": host,
            "key": key,
            "keyLocation": f"https://{host}/{key}.txt",
            "urlList": batch
        }
        
        try:
            response = requests.post(
                INDEXNOW_API_URL,
                json=payload,
                headers={'Content-Type': 'application/json; charset=utf-8'}
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": f"Successfully submitted {len(batch)} URLs",
                    "urls_count": len(batch)
                }
            elif response.status_code == 202:
                return {
                    "success": True,
                    "message": f"URLs accepted for processing ({len(batch)} URLs)",
                    "urls_count": len(batch)
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "urls_count": 0
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "urls_count": 0
            }

def main():
    print("""
============================================================
     INDEXNOW API - INSTANT URL INDEXING
     Website: https://allaitoollist.com/
============================================================
    """)
    
    print("[INFO] IndexNow submits to multiple search engines:")
    print("       - Bing")
    print("       - Yandex")
    print("       - Seznam.cz")
    print("       - Naver (and more)")
    print()
    
    # Extract host from SITE_URL
    host = SITE_URL.replace("https://", "").replace("http://", "").rstrip("/")
    
    print(f"Site: {SITE_URL}")
    print(f"Host: {host}")
    print(f"Sitemap: {SITEMAP_URL}\n")
    
    # Fetch URLs from sitemap
    print("[*] Fetching URLs from sitemap...")
    urls = fetch_sitemap_urls(SITEMAP_URL)
    
    if not urls:
        print("[ERROR] No URLs found in sitemap!")
        return
    
    print(f"[SUCCESS] Found {len(urls)} URLs\n")
    
    # Show sample URLs
    print("[*] Sample URLs to be submitted:")
    for url in urls[:5]:
        print(f"    - {url}")
    if len(urls) > 5:
        print(f"    ... and {len(urls) - 5} more\n")
    
    # Submit to IndexNow
    print(f"[*] Submitting {len(urls)} URLs to IndexNow API...")
    result = submit_to_indexnow(urls, host, INDEXNOW_KEY)
    
    if result["success"]:
        print(f"[SUCCESS] {result['message']}")
        print(f"[INFO] {result['urls_count']} URLs submitted successfully!")
        print()
        print("[INFO] Search engines will be notified instantly.")
        print("       Indexing typically happens within 24-48 hours.")
    else:
        print(f"[FAILED] {result.get('error', 'Unknown error')}")
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"indexnow_submission_{timestamp}.json"
    
    with open(results_file, 'w') as f:
        json.dump({
            "timestamp": timestamp,
            "site_url": SITE_URL,
            "host": host,
            "sitemap_url": SITEMAP_URL,
            "total_urls": len(urls),
            "submission_result": result,
            "urls": urls[:100]  # Save first 100 URLs as sample
        }, f, indent=2)
    
    print(f"\n[SAVED] Results saved to: {results_file}")
    
    print("\n" + "="*60)
    print("[IMPORTANT] Setup Required:")
    print("="*60)
    print(f"1. Create a file named: {INDEXNOW_KEY}.txt")
    print(f"2. Put this content in it: {INDEXNOW_KEY}")
    print(f"3. Upload to: https://{host}/{INDEXNOW_KEY}.txt")
    print("4. This verifies your ownership of the domain")
    print("="*60)
    
    print("\n" + "="*60)
    print("[NEXT STEPS]")
    print("="*60)
    print("1. Upload the key file to your website root")
    print("2. Wait 24-48 hours for search engines to index")
    print("3. Check Bing Webmaster Tools for indexing status")
    print("4. Monitor your site's search performance")
    print("="*60)

if __name__ == "__main__":
    main()
