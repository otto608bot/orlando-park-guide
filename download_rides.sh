#!/bin/bash
# Download real Wikimedia Commons photos for Disney rides
cd /Users/rufusbot/.openclaw/workspace/orlando-park-guide

UA="PlanYourPark/1.0 (planyourpark.com; educational)"

download_ride() {
    local ride_id="$1"
    local search_term="$2"
    local outfile="images/rides/${ride_id}.jpg"
    
    echo "=== Searching: $search_term ==="
    
    # Search Wikimedia Commons API
    local search_url="https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=$(echo "$search_term" | sed 's/ /+/g')&srnamespace=6&srlimit=5&format=json"
    
    local search_result=$(curl -s -H "User-Agent: $UA" "$search_url")
    
    # Extract first .jpg file title
    local file_title=$(echo "$search_result" | python3 -c "
import sys, json
data = json.load(sys.stdin)
results = data.get('query', {}).get('search', [])
for r in results:
    t = r['title']
    if t.lower().endswith('.jpg') or t.lower().endswith('.jpeg'):
        print(t)
        break
" 2>/dev/null)
    
    if [ -z "$file_title" ]; then
        echo "  SKIP: No JPG found for $ride_id"
        echo "$ride_id|FAILED|No JPG found" >> images/rides/download_log.txt
        return 1
    fi
    
    echo "  Found: $file_title"
    
    # Get image URL via imageinfo API
    local encoded_title=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$file_title'))")
    local info_url="https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded_title}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json"
    
    local info_result=$(curl -s -H "User-Agent: $UA" "$info_url")
    
    # Try thumburl first (1200px wide), fall back to full URL
    local image_url=$(echo "$info_result" | python3 -c "
import sys, json
data = json.load(sys.stdin)
pages = data.get('query', {}).get('pages', {})
for pid, page in pages.items():
    ii = page.get('imageinfo', [{}])[0]
    url = ii.get('thumburl') or ii.get('url', '')
    if url:
        print(url)
        break
" 2>/dev/null)
    
    if [ -z "$image_url" ]; then
        echo "  SKIP: Could not get URL for $ride_id"
        echo "$ride_id|FAILED|No URL" >> images/rides/download_log.txt
        return 1
    fi
    
    echo "  URL: $image_url"
    
    # Download
    curl -L -s -o "$outfile" "$image_url" -H "User-Agent: $UA" --max-time 30
    
    # Verify
    local filetype=$(file -b "$outfile" | head -1)
    if echo "$filetype" | grep -qi "jpeg\|jpg"; then
        local size=$(wc -c < "$outfile")
        echo "  OK: $ride_id ($size bytes) - $filetype"
        echo "$ride_id|OK|$size|$file_title" >> images/rides/download_log.txt
        return 0
    else
        echo "  FAIL: $ride_id - Got: $filetype"
        echo "$ride_id|FAILED|Bad filetype: $filetype" >> images/rides/download_log.txt
        rm -f "$outfile"
        return 1
    fi
}

# Clear log
> images/rides/download_log.txt

# Magic Kingdom (28 rides)
download_ride "mk-astro-orbiter" "Astro Orbiter Magic Kingdom"
sleep 2
download_ride "mk-barnstormer" "Barnstormer Magic Kingdom roller coaster"
sleep 2
download_ride "mk-big-thunder" "Big Thunder Mountain Railroad Magic Kingdom"
sleep 2
download_ride "mk-buzz" "Buzz Lightyear Space Ranger Spin"
sleep 2
download_ride "mk-country-bears" "Country Bear Jamboree Magic Kingdom"
sleep 2
download_ride "mk-dumbo" "Dumbo Flying Elephant Magic Kingdom"
sleep 2
download_ride "mk-enchanted-tales" "Enchanted Tales Belle Magic Kingdom"
sleep 2
download_ride "mk-haunted-mansion" "Haunted Mansion Magic Kingdom Walt Disney World"
sleep 2
download_ride "mk-small-world" "it's a small world Magic Kingdom"
sleep 2
download_ride "mk-jungle-cruise" "Jungle Cruise Magic Kingdom"
sleep 2
download_ride "mk-riverboat" "Liberty Square Riverboat Magic Kingdom"
sleep 2
download_ride "mk-tea-cups" "Mad Tea Party Magic Kingdom"
sleep 2
download_ride "mk-magic-carpets" "Magic Carpets Aladdin Magic Kingdom"
sleep 2
download_ride "mk-pooh" "Many Adventures Winnie Pooh Magic Kingdom"
sleep 2
download_ride "mk-philharmagic" "Mickey PhilharMagic Magic Kingdom"
sleep 2
download_ride "mk-peter-pan" "Peter Pan Flight Magic Kingdom"
sleep 2
download_ride "mk-pirates" "Pirates Caribbean Magic Kingdom Walt Disney World"
sleep 2
download_ride "mk-carousel" "Prince Charming Regal Carrousel Magic Kingdom"
sleep 2
download_ride "mk-seven-dwarfs" "Seven Dwarfs Mine Train Magic Kingdom"
sleep 2
download_ride "mk-space-mountain" "Space Mountain Magic Kingdom Walt Disney World"
sleep 2
download_ride "mk-treehouse" "Swiss Family Treehouse Magic Kingdom"
sleep 2
download_ride "mk-tiana" "Tiana Bayou Adventure Magic Kingdom"
sleep 2
download_ride "mk-speedway" "Tomorrowland Speedway Magic Kingdom"
sleep 2
download_ride "mk-peoplemover" "Tomorrowland Transit Authority PeopleMover"
sleep 2
download_ride "mk-tron" "TRON Lightcycle Run Magic Kingdom"
sleep 2
download_ride "mk-mermaid" "Under Sea Journey Little Mermaid Magic Kingdom"
sleep 2
download_ride "mk-railroad" "Walt Disney World Railroad Magic Kingdom"
sleep 2
download_ride "mk-carousel-progress" "Carousel Progress Magic Kingdom"
sleep 2

# EPCOT (14 rides)
download_ride "epcot-film-festival" "Disney Pixar Short Film Festival Epcot"
sleep 2
download_ride "epcot-frozen" "Frozen Ever After Epcot"
sleep 2
download_ride "epcot-gran-fiesta" "Gran Fiesta Tour Epcot"
sleep 2
download_ride "epcot-guardians" "Guardians Galaxy Cosmic Rewind Epcot"
sleep 2
download_ride "epcot-figment" "Journey Imagination Figment Epcot"
sleep 2
download_ride "epcot-living-land" "Living with the Land Epcot"
sleep 2
download_ride "epcot-mission-green" "Mission SPACE Epcot exterior"
sleep 2
download_ride "epcot-mission-orange" "Mission SPACE Epcot ride"
sleep 2
download_ride "epcot-remy" "Remy Ratatouille Adventure Epcot"
sleep 2
download_ride "epcot-nemo" "Seas Nemo Friends Epcot"
sleep 2
download_ride "epcot-soarin" "Soarin Around World Epcot"
sleep 2
download_ride "epcot-spaceship-earth" "Spaceship Earth Epcot"
sleep 2
download_ride "epcot-test-track" "Test Track Epcot"
sleep 2
download_ride "epcot-turtle-talk" "Turtle Talk Crush Epcot"
sleep 2

# Hollywood Studios (10 rides)
download_ride "hs-alien-saucers" "Alien Swirling Saucers Hollywood Studios"
sleep 2
download_ride "hs-runaway-railway" "Mickey Minnie Runaway Railway Hollywood Studios"
sleep 2
download_ride "hs-smugglers-run" "Millennium Falcon Smugglers Run Hollywood Studios"
sleep 2
download_ride "hs-rock-roller" "Rock Roller Coaster Aerosmith Hollywood Studios"
sleep 2
download_ride "hs-slinky" "Slinky Dog Dash Hollywood Studios"
sleep 2
download_ride "hs-star-tours" "Star Tours Hollywood Studios Walt Disney World"
sleep 2
download_ride "hs-rise-resistance" "Star Wars Rise Resistance Hollywood Studios"
sleep 2
download_ride "hs-toy-story-mania" "Toy Story Mania Hollywood Studios"
sleep 2
download_ride "hs-tower-terror" "Tower of Terror Hollywood Studios Walt Disney World"
sleep 2
download_ride "hs-muppet-vision" "Muppet Vision 3D Hollywood Studios"
sleep 2

# Animal Kingdom (9 rides)
download_ride "ak-flight-passage" "Avatar Flight Passage Animal Kingdom"
sleep 2
download_ride "ak-dinosaur" "DINOSAUR ride Animal Kingdom"
sleep 2
download_ride "ak-everest" "Expedition Everest Animal Kingdom"
sleep 2
download_ride "ak-bug" "Tough Bug Animal Kingdom Tree Life"
sleep 2
download_ride "ak-river-rapids" "Kali River Rapids Animal Kingdom"
sleep 2
download_ride "ak-safari" "Kilimanjaro Safaris Animal Kingdom"
sleep 2
download_ride "ak-navi" "Navi River Journey Animal Kingdom"
sleep 2
download_ride "ak-triceratop" "TriceraTop Spin Animal Kingdom"
sleep 2
download_ride "ak-wildlife-train" "Wildlife Express Train Animal Kingdom"

echo ""
echo "=== DOWNLOAD COMPLETE ==="
cat images/rides/download_log.txt
