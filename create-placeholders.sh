#!/bin/bash
# Create placeholder images for rides using ImageMagick

OUTDIR="/root/.openclaw/workspace/orlando-park-guide/images/rides"
cd "$OUTDIR" || exit 1

# Function to create placeholder image
create_placeholder() {
    local id=$1
    local name=$2
    local color=$3
    
    convert -size 800x600 xc:"$color" \
        -pointsize 30 -fill white -gravity center \
        -annotate +0+0 "$name\n\n[Image Placeholder]" \
        "${id}.jpg"
    
    echo "Created: ${id}.jpg"
}

# Magic Kingdom
create_placeholder "mk-space-mountain" "Space Mountain" "#1a1a2e"
create_placeholder "mk-big-thunder" "Big Thunder Mountain Railroad" "#8B4513"
create_placeholder "mk-haunted-mansion" "Haunted Mansion" "#2d1b4e"
create_placeholder "mk-pirates" "Pirates of the Caribbean" "#1e3a5f"
create_placeholder "mk-seven-dwarfs" "Seven Dwarfs Mine Train" "#FFD700"

# EPCOT
create_placeholder "epcot-guardians" "Guardians of the Galaxy: Cosmic Rewind" "#4a0080"
create_placeholder "epcot-remy" "Remy's Ratatouille Adventure" "#87CEEB"
create_placeholder "epcot-test-track" "Test Track" "#C0C0C0"
create_placeholder "epcot-soarin" "Soarin' Around the World" "#87CEEB"

# Hollywood Studios
create_placeholder "hs-rise-resistance" "Star Wars: Rise of the Resistance" "#000000"
create_placeholder "hs-slinky" "Slinky Dog Dash" "#FF6B35"
create_placeholder "hs-tower-terror" "Tower of Terror" "#4a0000"
create_placeholder "hs-smugglers-run" "Millennium Falcon: Smugglers Run" "#2d2d2d"

# Animal Kingdom
create_placeholder "ak-flight-passage" "Avatar Flight of Passage" "#0066CC"
create_placeholder "ak-everest" "Expedition Everest" "#8B7355"
create_placeholder "ak-safari" "Kilimanjaro Safaris" "#8FBC8F"

# Universal Studios Florida
create_placeholder "usf-gringotts" "Harry Potter: Escape from Gringotts" "#8B4513"
create_placeholder "usf-mummy" "Revenge of the Mummy" "#4a0000"
create_placeholder "usf-transformers" "TRANSFORMERS: The Ride-3D" "#FF0000"

# Islands of Adventure
create_placeholder "ioa-hagrid" "Hagrid's Magical Creatures Motorbike Adventure" "#228B22"
create_placeholder "ioa-velocicoaster" "Jurassic World VelociCoaster" "#006400"
create_placeholder "ioa-spiderman" "The Amazing Adventures of Spider-Man" "#FF0000"

# SeaWorld Orlando
create_placeholder "sw-mako" "Mako" "#006994"
create_placeholder "sw-kraken" "Kraken" "#4B0082"
create_placeholder "sw-journey-atlantis" "Journey to Atlantis" "#00CED1"

# LEGOLAND Florida
create_placeholder "ll-dragon" "The Dragon" "#FF0000"
create_placeholder "ll-coastersaurus" "Coastersaurus" "#8B4513"

echo ""
echo "All placeholder images created!"
ls -la *.jpg | wc -l
echo "images created."
