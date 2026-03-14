#!/usr/bin/env python3
"""
Ride Image Downloader
Downloads ride images from various sources with proper headers and retry logic.
"""

import os
import time
import requests
from pathlib import Path

OUTPUT_DIR = Path("/root/.openclaw/workspace/orlando-park-guide/images/rides")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Headers to mimic a real browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.google.com/',
}

# Known working Wikimedia Commons URLs for Disney rides
RIDE_IMAGES = {
    # Magic Kingdom
    "mk-space-mountain": {
        "name": "Space Mountain",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Magic_Kingdom_Space_Mountain.jpg/800px-Magic_Kingdom_Space_Mountain.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Magic_Kingdom_Space_Mountain.jpg/640px-Magic_Kingdom_Space_Mountain.jpg",
        ]
    },
    "mk-big-thunder": {
        "name": "Big Thunder Mountain Railroad",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Big_Thunder_Mountain_Railroad_-_Magic_Kingdom.jpg/800px-Big_Thunder_Mountain_Railroad_-_Magic_Kingdom.jpg",
        ]
    },
    "mk-haunted-mansion": {
        "name": "Haunted Mansion",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Haunted_Mansion_-_Magic_Kingdom.jpg/800px-Haunted_Mansion_-_Magic_Kingdom.jpg",
        ]
    },
    "mk-pirates": {
        "name": "Pirates of the Caribbean",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pirates_of_the_Caribbean_-_Magic_Kingdom.jpg/800px-Pirates_of_the_Caribbean_-_Magic_Kingdom.jpg",
        ]
    },
    "mk-seven-dwarfs": {
        "name": "Seven Dwarfs Mine Train",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Seven_Dwarfs_Mine_Train_-_Magic_Kingdom.jpg/800px-Seven_Dwarfs_Mine_Train_-_Magic_Kingdom.jpg",
        ]
    },
    # Animal Kingdom
    "ak-everest": {
        "name": "Expedition Everest",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Expedition_Everest_-_Animal_Kingdom.jpg/800px-Expedition_Everest_-_Animal_Kingdom.jpg",
        ]
    },
    "ak-safari": {
        "name": "Kilimanjaro Safaris",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kilimanjaro_Safaris_-_Animal_Kingdom.jpg/800px-Kilimanjaro_Safaris_-_Animal_Kingdom.jpg",
        ]
    },
    # Hollywood Studios
    "hs-tower-terror": {
        "name": "Tower of Terror",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tower_of_Terror_-_Hollywood_Studios.jpg/800px-Tower_of_Terror_-_Hollywood_Studios.jpg",
        ]
    },
}

def download_image(ride_id, ride_info):
    """Download image for a ride, trying multiple URLs."""
    output_path = OUTPUT_DIR / f"{ride_id}.jpg"
    
    print(f"\n📸 Processing: {ride_info['name']}")
    
    for url in ride_info['urls']:
        try:
            print(f"  Trying: {url[:60]}...")
            
            # Add delay to avoid rate limiting
            time.sleep(2)
            
            response = requests.get(url, headers=HEADERS, timeout=30, allow_redirects=True)
            
            if response.status_code == 200:
                content = response.content
                
                # Check if content is valid (not error page)
                if len(content) > 10000:  # At least 10KB
                    with open(output_path, 'wb') as f:
                        f.write(content)
                    print(f"  ✓ Success: {ride_id}.jpg ({len(content)} bytes)")
                    return True
                else:
                    print(f"  ✗ Too small: {len(content)} bytes")
            else:
                print(f"  ✗ HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"  ✗ Error: {e}")
        except Exception as e:
            print(f"  ✗ Unexpected error: {e}")
    
    print(f"  ✗ Failed to download any image for {ride_info['name']}")
    return False

def main():
    print("=" * 60)
    print("🎢 Ride Image Downloader")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Total rides to process: {len(RIDE_IMAGES)}")
    print("")
    
    success_count = 0
    failed_count = 0
    results = []
    
    for ride_id, ride_info in RIDE_IMAGES.items():
        if download_image(ride_id, ride_info):
            success_count += 1
            results.append({
                "id": ride_id,
                "name": ride_info['name'],
                "status": "success",
                "urls": ride_info['urls']
            })
        else:
            failed_count += 1
            results.append({
                "id": ride_id,
                "name": ride_info['name'],
                "status": "failed",
                "urls": ride_info['urls']
            })
    
    # Generate report
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"Total: {len(RIDE_IMAGES)}")
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {failed_count}")
    
    # Save results
    import json
    results_file = OUTPUT_DIR / "scraping-results.json"
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to: {results_file}")
    
    return success_count, failed_count

if __name__ == "__main__":
    main()
