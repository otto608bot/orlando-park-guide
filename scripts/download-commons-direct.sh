#!/bin/bash

# Simple Wikimedia Commons Image Downloader
# Uses direct URLs for known ride images

set -e

OUTPUT_DIR="/root/.openclaw/workspace/orlando-park-guide/images/rides"
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "Wikimedia Commons Direct Download"
echo "========================================"

# Array of rides with their Wikimedia Commons file names
# Format: "ride_id|commons_filename"
declare -a RIDES=(
    "space-mountain|Space_Mountain_(Magic_Kingdom)"
    "mk-big-thunder|Big_Thunder_Mountain_Railroad_(Magic_Kingdom)"
    "mk-haunted-mansion|The_Haunted_Mansion_(Magic_Kingdom)"
    "mk-pirates|Pirates_of_the_Caribbean_(Magic_Kingdom)"
    "mk-seven-dwarfs|Seven_Dwarfs_Mine_Train"
    "epcot-guardians|Guardians_of_the_Galaxy_Cosmic_Rewind"
    "epcot-remy|Remy's_Ratatouille_Adventure"
    "epcot-test-track|Test_Track"
    "epcot-soarin|Soarin'_Around_the_World"
    "hs-rise-resistance|Star_Wars_Rise_of_the_Resistance"
    "hs-slinky|Slinky_Dog_Dash"
    "hs-tower-terror|The_Twilight_Zone_Tower_of_Terror_(Disney's_Hollywood_Studios)"
    "hs-smugglers-run|Millennium_Falcon_Smugglers_Run"
    "ak-avatar|Avatar_Flight_of_Passage"
    "ak-everest|Expedition_Everest"
    "ak-safari|Kilimanjaro_Safaris"
    "uo-gringotts|Harry_Potter_and_the_Escape_from_Gringotts"
    "uo-mummy|Revenge_of_the_Mummy_(Universal_Studios)"
    "uo-transformers|Transformers_The_Ride_3D"
    "ioa-hagrids|Hagrid's_Magical_Creatures_Motorbike_Adventure"
    "ioa-velocicoaster|Jurassic_World_VelociCoaster"
    "ioa-spiderman|The_Amazing_Adventures_of_Spider-Man"
    "sw-mako|Mako_(SeaWorld)"
    "sw-kraken|Kraken_(SeaWorld)"
    "sw-atlantis|Journey_to_Atlantis_(SeaWorld)"
    "ll-dragon|The_Dragon_(LEGOLAND)"
    "ll-coastersaurus|Coastersaurus"
)

SUCCESS=0
FAILED=0

for RIDE in "${RIDES[@]}"; do
    IFS='|' read -r RIDE_ID COMMONS_NAME <<< "$RIDE"
    OUTPUT_FILE="$OUTPUT_DIR/$RIDE_ID.jpg"
    
    # Skip if already exists
    if [ -f "$OUTPUT_FILE" ]; then
        echo "✓ Already exists: $RIDE_ID.jpg"
        ((SUCCESS++))
        continue
    fi
    
    echo "--- Downloading: $RIDE_ID ---"
    
    # Try to download 800px thumbnail from Wikimedia Commons
    URL="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
    
    # Alternative URL patterns to try
    URLS=(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/${COMMONS_NAME}.jpg/800px-${COMMONS_NAME}.jpg"
    )
    
    DOWNLOADED=false
    for TRY_URL in "${URLS[@]}"; do
        if curl -s -L -o "$OUTPUT_FILE" "$TRY_URL" 2>/dev/null; then
            # Check if it's a valid image (not HTML error page)
            if file "$OUTPUT_FILE" | grep -q "JPEG image data"; then
                SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
                echo "✓ Downloaded: $RIDE_ID.jpg ($SIZE)"
                ((SUCCESS++))
                DOWNLOADED=true
                break
            else
                rm -f "$OUTPUT_FILE"
            fi
        fi
    done
    
    if [ "$DOWNLOADED" = false ]; then
        echo "✗ Failed: $RIDE_ID"
        ((FAILED++))
    fi
    
    # Sleep to be polite
    sleep 2
done

echo ""
echo "========================================"
echo "Download Complete"
echo "Success: $SUCCESS"
echo "Failed: $FAILED"
echo "========================================"
