import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urlparse

# Configuration
SITEMAP_INDEX_URL = "https://www.aixploria.com/en/sitemap.xml"
OUTPUT_FILE = "scraped_tools.json"
MAX_TOOLS_TO_SCRAPE = 30  # Limit for testing, increase later

def get_xml_content(url):
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code == 200:
            return response.content
        else:
            print(f"Failed to fetch {url}: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_sitemap_index(xml_content):
    root = ET.fromstring(xml_content)
    sitemaps = []
    for sitemap in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}sitemap"):
        loc = sitemap.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text
        # Prioritize posttype-post sitemaps
        if "posttype-post" in loc:
            sitemaps.append(loc)
    return sitemaps

def parse_sitemap_urls(xml_content):
    root = ET.fromstring(xml_content)
    urls = []
    for url in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url"):
        loc = url.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text
        urls.append(loc)
    return urls

def scrape_tool_page(url):
    try:
        print(f"Scraping: {url}")
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code != 200:
            print(f"Failed to load page: {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract Data - This needs to be adjusted based on actual page structure
        # I'll try to find common elements/classes based on typical WP sites or inspect the HTML if needed.
        # Since I can't inspect interactively easily, I'll make best guesses and we might need to iterate.
        
        # Title
        title_tag = soup.find('h1')
        title = title_tag.get_text(strip=True) if title_tag else ""
    # Description logic
        description = ""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc['content']
        else:
            p = soup.find('p')
            if p:
                description = p.get_text(strip=True)

        content_div = soup.select_one('.entry-content') 
        
        # Pricing Logic
        pricing = "Unknown"
        text_content = soup.get_text().lower()
        if "free" in text_content: 
             pricing = "Free"
        if "paid" in text_content or "pricing" in text_content:
             if pricing == "Free": pricing = "Freemium" 
             else: pricing = "Paid"
        categories = []
        tags = []
        
        # Try finding categories in breadcrumbs or specific meta tags
        # Common WP structure for categories
        for cat in soup.select('.cat-links a, .post-categories a, .entry-category a, a[rel="category tag"]'):
            categories.append(cat.get_text(strip=True))

        for tag in soup.select('.tags-links a, .post-tags a, a[rel="tag"]'):
            tags.append(tag.get_text(strip=True))

        # External Link - Iteration 3
        external_link = ""
        
        # Strategy 1: Look for internal redirect links (/out/)
        # This is very common in affiliate/directory sites
        out_links = []
        for a in soup.find_all('a', href=True):
            if '/out/' in a['href']:
                out_links.append(a['href'])
        
        if out_links:
            # If multiple, usually the first one or the one in the header/hero is the main one.
            # We'll take the first one distinct from the current page
            for link in out_links:
                if link != url:
                     external_link = link
                     break
        
        # Strategy 2: Look for button with text "Visit"
        if not external_link:
             possible_buttons = soup.select('.wp-block-button__link, .btn, .button, a.visit-btn')
             for btn in possible_buttons:
                text = btn.get_text(strip=True).lower()
                href = btn.get('href', '')
                if ('visit' in text or 'website' in text) and 'aixploria' not in href:
                    external_link = href
                    break

        # Strategy 3: Try to find "Visit Website" link specifically
        if not external_link:
             for a in soup.find_all('a', href=True):
                 text = a.get_text(strip=True).lower()
                 if "visit" in text and "site" in text:
                      # Check if it's not a category or internal link
                      href = a['href']
                      if "aixploria.com" not in href and "category" not in href:
                           external_link = href
                           break

        # Resolve Redirect if it's an /out/ link
        if external_link and "aixploria.com/out/" in external_link:
            try:
                # Resolve the redirect to get the actual URL
                # Use a session to keep cookies or headers if needed
                head_resp = requests.head(external_link, headers={'User-Agent': 'Mozilla/5.0'}, allow_redirects=True, timeout=5)
                if head_resp.status_code == 200:
                    external_link = head_resp.url
            except:
                pass # Keep the /out/ link if resolution fails


        # Full Description Cleanup
        if content_div:
            # Remove "More sites like..." and footer junk if possible
            # We can stop reading after a certain keyword
            full_text = content_div.get_text(separator=' ', strip=True)
            if "More sites like" in full_text:
                full_text = full_text.split("More sites like")[0]
            full_description = full_text
        else:
             full_description = description # Fallback

        # Categorization fallback
        if not categories:
             # Try parsing from breadcrumbs if available
             breadcrumbs = soup.select('.breadcrumbs a, .yoast-breadcrumbs a')
             if breadcrumbs and len(breadcrumbs) > 1:
                 # usually Home > Category > Tool
                 categories.append(breadcrumbs[1].get_text(strip=True))

        return {
            "name": title,
            "short_description": description,
            "full_description": full_description,
            "url": external_link if external_link else url, 
            "category": categories[0] if categories else "Uncategorized",
            "tags": tags,
            "pricing": pricing,
            "source_url": url
        }

    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def main():
    print("Fetching sitemap index...")
    xml_content = get_xml_content(SITEMAP_INDEX_URL)
    if not xml_content:
        return

    sitemap_urls = parse_sitemap_index(xml_content)
    print(f"Found {len(sitemap_urls)} sitemaps.")

    tools = []
    
    # Process the most recent sitemaps first (usually listed first or last? XML order varies)
    # The snippet showed dates, recent ones might be relevant.
    # We will just take the first one for the test.
    # Process all sitemaps
    if sitemap_urls:
        print(f"Found {len(sitemap_urls)} sitemaps to process.")
        
        for sitemap_url in sitemap_urls:
            print(f"Processing sitemap: {sitemap_url}")
            sitemap_content = get_xml_content(sitemap_url)
            
            if sitemap_content:
                tool_urls = parse_sitemap_urls(sitemap_content)
                print(f"Found {len(tool_urls)} tools in this sitemap.")
                
                for tool_url in tool_urls:
                    data = scrape_tool_page(tool_url)
                    if data:
                        tools.append(data)
                        
                        # Incremental save every 10 tools
                        if len(tools) % 10 == 0:
                            print(f"Saved {len(tools)} tools so far...")
                            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                                json.dump(tools, f, indent=2)
                                
                    time.sleep(1) # Be polite
    
    # Final Save
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(tools, f, indent=2)
    
    print(f"Scraped total {len(tools)} tools. Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
