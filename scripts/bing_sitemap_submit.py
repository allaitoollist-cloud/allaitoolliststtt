"""
Bing Webmaster API - Sitemap Submission Script
Submit sitemap directly to Bing for indexing all URLs at once
"""

import requests
import json
from datetime import datetime
from bing_config import API_KEY, SITE_URL, SITEMAP_URL

class BingWebmasterAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://ssl.bing.com/webmaster/api.svc/json"
        
    def submit_sitemap(self, site_url, sitemap_url):
        """Submit sitemap to Bing"""
        endpoint = f"{self.base_url}/SubmitSitemap"
        
        params = {
            'apikey': self.api_key
        }
        
        data = {
            'siteUrl': site_url,
            'feedUrl': sitemap_url
        }
        
        try:
            response = requests.post(endpoint, params=params, json=data)
            
            if response.status_code == 200:
                return {"success": True, "message": "Sitemap submitted successfully"}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_sitemaps(self, site_url):
        """Get list of submitted sitemaps"""
        endpoint = f"{self.base_url}/GetSitemaps"
        
        params = {
            'apikey': self.api_key,
            'siteUrl': site_url
        }
        
        try:
            response = requests.get(endpoint, params=params)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def submit_content(self, site_url, url):
        """Submit a single URL using SubmitContent endpoint"""
        endpoint = f"{self.base_url}/SubmitContent"
        
        params = {
            'apikey': self.api_key
        }
        
        data = {
            'siteUrl': site_url,
            'url': url
        }
        
        try:
            response = requests.post(endpoint, params=params, json=data)
            
            if response.status_code == 200:
                return {"success": True, "message": "URL submitted successfully"}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

def main():
    """Main execution function"""
    print("""
============================================================
     BING WEBMASTER - SITEMAP SUBMISSION
     Website: https://allaitoollist.com/
============================================================
    """)
    
    api = BingWebmasterAPI(API_KEY)
    
    print(f"Site URL: {SITE_URL}")
    print(f"Sitemap URL: {SITEMAP_URL}\n")
    
    # Submit sitemap
    print("[*] Submitting sitemap to Bing...")
    result = api.submit_sitemap(SITE_URL, SITEMAP_URL)
    
    if result["success"]:
        print("[SUCCESS] Sitemap submitted successfully!")
        print(f"   {result['message']}")
        print("\n[INFO] Bing will now crawl and index all URLs from your sitemap.")
        print("   This may take 24-48 hours to complete.")
    else:
        print(f"[FAILED] {result.get('error', 'Unknown error')}")
        print("\n[*] Trying alternative method: SubmitContent...")
        
        # Try submitting homepage as fallback
        content_result = api.submit_content(SITE_URL, SITE_URL)
        if content_result["success"]:
            print("[SUCCESS] Homepage submitted successfully!")
            print("   Note: You may need to submit sitemap through Bing Webmaster Tools dashboard")
        else:
            print(f"[FAILED] Alternative method also failed: {content_result.get('error', 'Unknown error')}")
    
    # Get existing sitemaps
    print("\n[*] Checking existing sitemaps...")
    sitemaps_result = api.get_sitemaps(SITE_URL)
    
    if sitemaps_result["success"]:
        sitemaps = sitemaps_result.get("data", [])
        if sitemaps:
            print(f"[SUCCESS] Found {len(sitemaps)} sitemap(s):")
            for sitemap in sitemaps:
                print(f"   - {sitemap}")
        else:
            print("   No sitemaps found yet.")
    else:
        print(f"   Could not retrieve sitemaps: {sitemaps_result.get('error', 'Unknown error')}")
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"sitemap_submission_{timestamp}.json"
    
    with open(results_file, 'w') as f:
        json.dump({
            "timestamp": timestamp,
            "site_url": SITE_URL,
            "sitemap_url": SITEMAP_URL,
            "submission_result": result,
            "sitemaps": sitemaps_result
        }, f, indent=2)
    
    print(f"\n[SAVED] Results saved to: {results_file}")
    
    print("\n" + "="*60)
    print("[NEXT STEPS]")
    print("="*60)
    print("1. Wait 24-48 hours for Bing to crawl your sitemap")
    print("2. Check indexing status in Bing Webmaster Tools")
    print("3. Monitor your site's performance in Bing search")
    print("="*60)

if __name__ == "__main__":
    main()
