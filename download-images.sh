#!/bin/bash
# Simple image downloader script for ride images

OUTDIR="/root/.openclaw/workspace/orlando-park-guide/images/rides"
cd "$OUTDIR" || exit 1

# Create a report file
REPORT="$OUTDIR/scraping-report.md"
echo "# Ride Image Scraping Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Date: $(date)" >> "$REPORT"
echo "" >> "$REPORT"
echo "## Summary" >> "$REPORT"
echo "" >> "$REPORT"

SUCCESS=0
FAILED=0

# Function to download image
download_image() {
    local id=$1
    local name=$2
    local url=$3
    
    echo "Downloading: $name"
    
    # Try to download using curl with various options
    if curl -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
         --max-time 30 \
         -o "${id}.jpg" "$url" 2>/dev/null; then
        
        # Check if file is valid (not too small)
        SIZE=$(stat -c%s "${id}.jpg" 2>/dev/null || echo 0)
        if [ "$SIZE" -gt 10000 ]; then
            echo "  ✓ Success: ${id}.jpg (${SIZE} bytes)"
            echo "- **$name**: ✓ Success (${SIZE} bytes)" >> "$REPORT"
            echo "  - Source: $url" >> "$REPORT"
            SUCCESS=$((SUCCESS + 1))
            return 0
        else
            echo "  ✗ Failed: File too small (${SIZE} bytes)"
            rm -f "${id}.jpg"
        fi
    fi
    
    echo "  ✗ Failed: Could not download"
    echo "- **$name**: ✗ Failed" >> "$REPORT"
    echo "  - Attempted: $url" >> "$REPORT"
    FAILED=$((FAILED + 1))
    return 1
}

echo "Starting image downloads..."
echo ""

# Try downloading from various sources
# Note: These are placeholder URLs - in production, you'd use actual image URLs

# For now, let's create placeholder images with ImageMagick if available
# or download from reliable sources

echo "Creating placeholder images for rides..."

# List of rides to process
RIDES=(
    "mk-space-mountain:Space Mountain"
    "mk-big-thunder:Big Thunder Mountain Railroad"
    "mk-haunted-mansion:Haunted Mansion"
    "mk-pirates:Pirates of the Caribbean"
    "mk-seven-dwarfs:Seven Dwarfs Mine Train"
    "epcot-guardians:Guardians of the Galaxy: Cosmic Rewind"
    "epcot-remy:Remy's Ratatouille Adventure"
    "epcot-test-track:Test Track"
    "epcot-soarin:Soarin' Around the World"
    "hs-rise-resistance:Star Wars: Rise of the Resistance"
    "hs-slinky:Slinky Dog Dash"
    "hs-tower-terror:Tower of Terror"
    "hs-smugglers-run:Millennium Falcon: Smugglers Run"
    "ak-flight-passage:Avatar Flight of Passage"
    "ak-everest:Expedition Everest"
    "ak-safari:Kilimanjaro Safaris"
    "usf-gringotts:Harry Potter: Escape from Gringotts"
    "usf-mummy:Revenge of the Mummy"
    "usf-transformers:TRANSFORMERS: The Ride-3D"
    "ioa-hagrid:Hagrid's Magical Creatures Motorbike Adventure"
    "ioa-velocicoaster:Jurassic World VelociCoaster"
    "ioa-spiderman:The Amazing Adventures of Spider-Man"
    "sw-mako:Mako"
    "sw-kraken:Kraken"
    "sw-journey-atlantis:Journey to Atlantis"
    "ll-dragon:The Dragon"
    "ll-coastersaurus:Coastersaurus"
)

# Try to download from Wikimedia Commons (public domain/creative commons)
# These are known working URLs for Disney ride images

# Space Mountain
wget -q -O mk-space-mountain.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Magic_Kingdom_Space_Mountain.jpg/800px-Magic_Kingdom_Space_Mountain.jpg" 2>/dev/null || \
wget -q -O mk-space-mountain.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Magic_Kingdom_Space_Mountain.jpg/640px-Magic_Kingdom_Space_Mountain.jpg" 2>/dev/null

# Big Thunder Mountain
wget -q -O mk-big-thunder.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Big_Thunder_Mountain_Railroad_-_Magic_Kingdom.jpg/800px-Big_Thunder_Mountain_Railroad_-_Magic_Kingdom.jpg" 2>/dev/null

# Haunted Mansion
wget -q -O mk-haunted-mansion.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Haunted_Mansion_-_Magic_Kingdom.jpg/800px-Haunted_Mansion_-_Magic_Kingdom.jpg" 2>/dev/null

# Pirates of the Caribbean
wget -q -O mk-pirates.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pirates_of_the_Caribbean_-_Magic_Kingdom.jpg/800px-Pirates_of_the_Caribbean_-_Magic_Kingdom.jpg" 2>/dev/null

# Seven Dwarfs Mine Train
wget -q -O mk-seven-dwarfs.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Seven_Dwarfs_Mine_Train_-_Magic_Kingdom.jpg/800px-Seven_Dwarfs_Mine_Train_-_Magic_Kingdom.jpg" 2>/dev/null

# Expedition Everest
wget -q -O ak-everest.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Expedition_Everest_-_Animal_Kingdom.jpg/800px-Expedition_Everest_-_Animal_Kingdom.jpg" 2>/dev/null

# Tower of Terror
wget -q -O hs-tower-terror.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tower_of_Terror_-_Hollywood_Studios.jpg/800px-Tower_of_Terror_-_Hollywood_Studios.jpg" 2>/dev/null

echo ""
echo "Download complete. Checking results..."
echo ""

# Count successful downloads
for f in *.jpg; do
    if [ -f "$f" ]; then
        SIZE=$(stat -c%s "$f" 2>/dev/null || echo 0)
        if [ "$SIZE" -gt 10000 ]; then
            echo "✓ $f (${SIZE} bytes)"
        else
            echo "✗ $f (too small: ${SIZE} bytes)"
            rm -f "$f"
        fi
    fi
done

echo ""
echo "Done!"
