#!/bin/bash

# Download ride images using Wikimedia Commons API
# This gets the correct thumbnail URL via API

set -e

OUTPUT_DIR="/root/.openclaw/workspace/orlando-park-guide/images/rides"
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "Wikimedia Commons API Downloader"
echo "========================================"

# Function to download image from Commons
download_image() {
    local RIDE_ID=$1
    local SEARCH_TERM=$2
    local OUTPUT_FILE="$OUTPUT_DIR/$RIDE_ID.jpg"
    
    # Skip if exists
    if [ -f "$OUTPUT_FILE" ]; then
        echo "✓ Exists: $RIDE_ID.jpg"
        return 0
    fi
    
    echo "--- Searching: $SEARCH_TERM ---"
    
    # Search Commons API for images
    SEARCH_URL="https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${SEARCH_TERM}&srnamespace=6&format=json"
    
    # Get search results
    RESULT=$(curl -s "$SEARCH_URL" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('query',{}).get('search',[{}])[0].get('title',''))" 2>/dev/null || echo "")
    
    if [ -z "$RESULT" ] || [ "$RESULT" = "" ]; then
        echo "✗ No results for: $SEARCH_TERM"
        return 1
    fi
    
    echo "  Found: $RESULT"
    
    # Get image URL from file page
    FILE_NAME=$(echo "$RESULT" | sed 's/File://')
    IMAGE_API="https://commons.wikimedia.org/w/api.php?action=query&titles=File:${FILE_NAME}&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json"
    
    # Get the thumbnail URL
    THUMB_URL=$(curl -s "$IMAGE_API" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    pages = d.get('query', {}).get('pages', {})
    for page_id, page in pages.items():
        imginfo = page.get('imageinfo', [{}])[0]
        # Try thumburl first, then url
        url = imginfo.get('thumburl', imginfo.get('url', ''))
        print(url)
except:
    print('')
" 2>/dev/null)
    
    if [ -z "$THUMB_URL" ] || [ "$THUMB_URL" = "" ]; then
        echo "✗ No image URL for: $FILE_NAME"
        return 1
    fi
    
    echo "  Downloading..."
    
    # Download the image
    if curl -s -L -o "$OUTPUT_FILE" "$THUMB_URL"; then
        # Verify it's a valid image
        if file "$OUTPUT_FILE" | grep -q "JPEG image data"; then
            SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
            echo "✓ Downloaded: $RIDE_ID.jpg ($SIZE)"
            return 0
        else
            echo "✗ Invalid image: $RIDE_ID"
            rm -f "$OUTPUT_FILE"
            return 1
        fi
    else
        echo "✗ Download failed: $RIDE_ID"
        return 1
    fi
}

# Download images for each ride
declare -a RIDES=(
    "space-mountain:Space Mountain Magic Kingdom"
    "mk-big-thunder:Big Thunder Mountain Railroad Magic Kingdom"
    "mk-haunted-mansion:Haunted Mansion Magic Kingdom"
    "mk-pirates:Pirates of the Caribbean Magic Kingdom"
    "mk-seven-dwarfs:Seven Dwarfs Mine Train"
    "epcot-guardians:Guardians of the Galaxy Cosmic Rewind EPCOT"
    "epcot-remy:Remy Ratatouille Adventure EPCOT"
    "epcot-test-track:Test Track EPCOT"
    "epcot-soarin:Soarin EPCOT"
    "hs-rise-resistance:Star Wars Rise of the Resistance"
    "hs-slinky:Slinky Dog Dash"
    "hs-tower-terror:Tower of Terror Hollywood Studios"
    "hs-smugglers-run:Millennium Falcon Smugglers Run"
    "ak-avatar:Avatar Flight of Passage"
    "ak-everest:Expedition Everest"
    "ak-safari:Kilimanjaro Safaris"
    "uo-gringotts:Harry Potter Escape from Gringotts"
    "uo-mummy:Revenge of the Mummy Universal"
    "uo-transformers:Transformers The Ride Universal"
    "ioa-hagrids:Hagrid Magical Creatures Motorbike Adventure"
    "ioa-velocicoaster:Jurassic World VelociCoaster"
    "ioa-spiderman:Amazing Adventures of Spider-Man"
    "sw-mako:Mako SeaWorld"
    "sw-kraken:Kraken SeaWorld"
    "sw-atlantis:Journey to Atlantis SeaWorld"
    "ll-dragon:The Dragon LEGOLAND"
    "ll-coastersaurus:Coastersaurus LEGOLAND"
)

SUCCESS=0
FAILED=0

for RIDE in "${RIDES[@]}"; do
    IFS=':' read -r RIDE_ID SEARCH_TERM <<< "$RIDE"
    
    if download_image "$RIDE_ID" "$SEARCH_TERM"; then
        ((SUCCESS++))
    else
        ((FAILED++))
    fi
    
    # Rate limiting
    sleep 2
done

echo ""
echo "========================================"
echo "Download Complete"
echo "Success: $SUCCESS"
echo "Failed: $FAILED"
echo "Total: $((SUCCESS + FAILED))"
echo "========================================"
