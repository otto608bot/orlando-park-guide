#!/usr/bin/env python3
"""
Wikimedia Commons Image Downloader
Downloads ride images from Wikimedia Commons API
"""

import json
import urllib.request
import urllib.parse
import time
import os
from pathlib import Path

OUTPUT_DIR = Path("/root/.openclaw/workspace/orlando-park-guide/images/rides")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

RIDES = [
    ("space-mountain", "Space Mountain Magic Kingdom"),
    ("mk-big-thunder", "Big Thunder Mountain Railroad Magic Kingdom"),
    ("mk-haunted-mansion", "Haunted Mansion Magic Kingdom"),
    ("mk-pirates", "Pirates of the Caribbean Magic Kingdom"),
    ("mk-seven-dwarfs", "Seven Dwarfs Mine Train"),
    ("epcot-guardians", "Guardians of the Galaxy Cosmic Rewind"),
    ("epcot-remy", "Remy Ratatouille Adventure"),
    ("epcot-test-track", "Test Track"),
    ("epcot-soarin", "Soarin"),
    ("hs-rise-resistance", "Star Wars Rise of the Resistance"),
    ("hs-slinky", "Slinky Dog Dash"),
    ("hs-tower-terror", "Tower of Terror Disney"),
    ("hs-smugglers-run", "Millennium Falcon Smugglers Run"),
    ("ak-avatar", "Avatar Flight of Passage"),
    ("ak-everest", "Expedition Everest"),
    ("ak-safari", "Kilimanjaro Safaris"),
    ("uo-gringotts", "Harry Potter Escape from Gringotts"),
    ("uo-mummy", "Revenge of the Mummy Universal"),
    ("uo-transformers", "Transformers The Ride Universal"),
    ("ioa-hagrids", "Hagrid Magical Creatures Motorbike Adventure"),
    ("ioa-velocicoaster", "Jurassic World VelociCoaster"),
    ("ioa-spiderman", "Amazing Adventures of Spider-Man"),
    ("sw-mako", "Mako SeaWorld Orlando"),
    ("sw-kraken", "Kraken SeaWorld Orlando"),
    ("sw-atlantis", "Journey to Atlantis SeaWorld"),
    ("ll-dragon", "The Dragon LEGOLAND Florida"),
    ("ll-coastersaurus", "Coastersaurus LEGOLAND"),
]

def api_call(url):
    """Make API call and return JSON"""
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"  API error: {e}")
        return None

def download_image(ride_id, search_term):
    """Download image for a ride"""
    output_file = OUTPUT_DIR / f"{ride_id}.jpg"
    
    # Skip if exists
    if output_file.exists():
        size = output_file.stat().st_size
        print(f"✓ {ride_id}: Already exists ({size//1024}KB)")
        return True
    
    print(f"--- {ride_id} ---")
    print(f"  Searching: {search_term}")
    
    # Search Commons
    search_query = urllib.parse.quote(search_term)
    search_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={search_query}&srnamespace=6&format=json"
    
    search_data = api_call(search_url)
    if not search_data:
        print(f"  ✗ Search failed")
        return False
    
    results = search_data.get('query', {}).get('search', [])
    if not results:
        print(f"  ✗ No results")
        return False
    
    # Get first result
    file_title = results[0].get('title', '')
    if not file_title:
        print(f"  ✗ No file found")
        return False
    
    print(f"  Found: {file_title}")
    
    # Get image URL
    file_name = file_title.replace('File:', '')
    image_api = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(file_name)}&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json"
    
    image_data = api_call(image_api)
    if not image_data:
        print(f"  ✗ Image API failed")
        return False
    
    pages = image_data.get('query', {}).get('pages', {})
    thumb_url = None
    
    for page_id, page in pages.items():
        imginfo = page.get('imageinfo', [{}])[0]
        thumb_url = imginfo.get('thumburl') or imginfo.get('url')
        if thumb_url:
            break
    
    if not thumb_url:
        print(f"  ✗ No image URL")
        return False
    
    print(f"  Downloading...")
    
    # Download image
    try:
        urllib.request.urlretrieve(thumb_url, output_file)
        
        # Verify it's a valid image
        with open(output_file, 'rb') as f:
            header = f.read(4)
            if header[:2] == b'\xff\xd8':  # JPEG magic number
                size = output_file.stat().st_size
                print(f"  ✓ Downloaded ({size//1024}KB)")
                return True
            else:
                print(f"  ✗ Not a valid JPEG")
                output_file.unlink()
                return False
    except Exception as e:
        print(f"  ✗ Download error: {e}")
        if output_file.exists():
            output_file.unlink()
        return False

def main():
    print("=" * 50)
    print("Wikimedia Commons Image Downloader")
    print("=" * 50)
    print()
    
    success = 0
    failed = 0
    
    for ride_id, search_term in RIDES:
        if download_image(ride_id, search_term):
            success += 1
        else:
            failed += 1
        
        time.sleep(2)  # Rate limiting
    
    print()
    print("=" * 50)
    print(f"Complete: {success} success, {failed} failed")
    print("=" * 50)

if __name__ == "__main__":
    main()
