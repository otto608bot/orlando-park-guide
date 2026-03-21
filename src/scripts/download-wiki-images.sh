#!/bin/bash

# Wikipedia/Wikimedia Image Downloader for Orlando Park Guide
# Uses Wikipedia API to find and download ride images

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/images/rides"
LOG_FILE="$PROJECT_DIR/logs/wiki-download.log"
SLEEP_TIME=2

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Log function
log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

# URL encode function
url_encode() {
    local string="$1"
    local encoded=""
    local pos c o
    
    for (( pos=0; pos<${#string}; pos++ )); do
        c=${string:$pos:1}
        case "$c" in
            [-_.~a-zA-Z0-9]) encoded+="$c" ;;
            *) printf -v o '%%%02x' "'$c"; encoded+="$o" ;;
        esac
    done
    echo "$encoded"
}

# Download image from Wikimedia Commons URL
download_image() {
    local url="$1"
    local output_path="$2"
    
    log "Downloading: $url"
    
    if curl -sL --fail --max-time 30 "$url" -o "$output_path"; then
        local size
        size=$(stat -c%s "$output_path" 2>/dev/null || stat -f%z "$output_path" 2>/dev/null || echo "0")
        log "✓ Saved: $output_path (${size} bytes)"
        return 0
    else
        log "✗ Failed to download: $url"
        rm -f "$output_path"
        return 1
    fi
}

# Get image URL from File: page using Wikipedia API
get_image_url_from_file() {
    local filename="$1"
    local encoded_filename
    encoded_filename=$(url_encode "$filename")
    
    local api_url="https://en.wikipedia.org/w/api.php?action=query&titles=File:${encoded_filename}&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json"
    
    log "API call: Getting image URL for $filename"
    
    local response
    response=$(curl -s --max-time 15 "$api_url")
    
    # Extract thumb URL (800px) or full URL
    local thumb_url
    thumb_url=$(echo "$response" | grep -o '"thumburl":"[^"]*"' | head -1 | sed 's/"thumburl":"//;s/"$//')
    
    if [[ -n "$thumb_url" ]]; then
        echo "$thumb_url"
        return 0
    fi
    
    # Fallback to full URL
    local full_url
    full_url=$(echo "$response" | grep -o '"url":"[^"]*"' | head -1 | sed 's/"url":"//;s/"$//')
    
    if [[ -n "$full_url" ]]; then
        echo "$full_url"
        return 0
    fi
    
    return 1
}

# Search for ride page and get images
search_and_download() {
    local ride_name="$1"
    local ride_id="$2"
    local park_name="$3"
    local output_path="$OUTPUT_DIR/${ride_id}.jpg"
    
    log "--- Processing: $ride_name ($park_name) ---"
    
    # Skip if already exists
    if [[ -f "$output_path" ]]; then
        log "Image already exists: $output_path"
        return 0
    fi
    
    # Step 1: Search for the ride page
    local search_query="${ride_name} ${park_name}"
    local encoded_query
    encoded_query=$(url_encode "$search_query")
    
    local search_url="https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded_query}&srlimit=5&format=json"
    
    log "Searching: $search_query"
    
    local search_response
    search_response=$(curl -s --max-time 15 "$search_url")
    
    # Extract first result title
    local page_title
    page_title=$(echo "$search_response" | grep -o '"title":"[^"]*"' | head -1 | sed 's/"title":"//;s/"$//')
    
    if [[ -z "$page_title" ]]; then
        log "✗ No search results found for: $search_query"
        return 1
    fi
    
    log "Found page: $page_title"
    
    # Step 2: Get images from the page
    local encoded_title
    encoded_title=$(url_encode "$page_title")
    local images_url="https://en.wikipedia.org/w/api.php?action=query&titles=${encoded_title}&prop=images&imlimit=20&format=json"
    
    log "Getting images from page..."
    
    local images_response
    images_response=$(curl -s --max-time 15 "$images_url")
    
    # Extract image filenames (filter for common image types)
    local image_files
    image_files=$(echo "$images_response" | grep -o '"title":"File:[^"]*\.\(jpg\|jpeg\|png\)"' | sed 's/"title":"//;s/"$//' | head -5)
    
    if [[ -z "$image_files" ]]; then
        log "✗ No images found on page: $page_title"
        return 1
    fi
    
    # Step 3: Try each image until one downloads successfully
    local img_file img_url
    while IFS= read -r img_file; do
        [[ -z "$img_file" ]] && continue
        
        log "Trying image: $img_file"
        
        img_url=$(get_image_url_from_file "$img_file")
        
        if [[ -n "$img_url" ]]; then
            # Decode URL (Wikipedia returns escaped URLs)
            img_url=$(echo "$img_url" | sed 's/\\\//\//g')
            
            if download_image "$img_url" "$output_path"; then
                return 0
            fi
        fi
        
        sleep 1
    done <<< "$image_files"
    
    log "✗ Failed to download any image for: $ride_name"
    return 1
}

# Alternative: Direct Wikimedia Commons download using known patterns
download_from_commons() {
    local ride_name="$1"
    local ride_id="$2"
    local commons_filename="$3"
    local output_path="$OUTPUT_DIR/${ride_id}.jpg"
    
    log "--- Trying direct Commons download: $ride_name ---"
    
    # Skip if already exists
    if [[ -f "$output_path" ]]; then
        log "Image already exists: $output_path"
        return 0
    fi
    
    # Try to get URL via API
    local img_url
    img_url=$(get_image_url_from_file "$commons_filename")
    
    if [[ -n "$img_url" ]]; then
        img_url=$(echo "$img_url" | sed 's/\\\//\//g')
        if download_image "$img_url" "$output_path"; then
            return 0
        fi
    fi
    
    return 1
}

# Main execution
main() {
    log "========================================"
    log "Wikipedia Image Downloader Started"
    log "Output directory: $OUTPUT_DIR"
    log "========================================"
    
    local success_count=0
    local fail_count=0
    
    # Define rides with their search terms and fallback Commons filenames
    declare -a rides=(
        "space-mountain|Space Mountain|Magic Kingdom|Space_Mountain_(Magic_Kingdom).jpg"
        "big-thunder-mountain|Big Thunder Mountain Railroad|Magic Kingdom|Big_Thunder_Mountain_Railroad.jpg"
        "haunted-mansion|Haunted Mansion|Magic Kingdom|The_Haunted_Mansion.jpg"
        "pirates-caribbean|Pirates of the Caribbean|Magic Kingdom|Pirates_of_the_Caribbean_(Magic_Kingdom).jpg"
        "seven-dwarfs|Seven Dwarfs Mine Train|Magic Kingdom|Seven_Dwarfs_Mine_Train.jpg"
        "cosmic-rewind|Guardians of the Galaxy Cosmic Rewind|EPCOT|Guardians_of_the_Galaxy_Cosmic_Rewind.jpg"
        "remy|Remy's Ratatouille Adventure|EPCOT|Remy's_Ratatouille_Adventure.jpg"
        "test-track|Test Track|EPCOT|Test_Track.jpg"
        "soarin|Soarin'|EPCOT|Soarin'_Epcot.jpg"
        "rise-resistance|Star Wars Rise of the Resistance|Hollywood Studios|Rise_of_the_Resistance.jpg"
        "slinky-dash|Slink Dog Dash|Hollywood Studios|Slink_Dog_Dash.jpg"
        "tower-terror|The Twilight Zone Tower of Terror|Hollywood Studios|The_Twilight_Zone_Tower_of_Terror.jpg"
        "millennium-falcon|Millennium Falcon Smugglers Run|Hollywood Studios|Millennium_Falcon_Smugglers_Run.jpg"
        "flight-passage|Avatar Flight of Passage|Animal Kingdom|Flight_of_Passage.jpg"
        "expedition-everest|Expedition Everest|Animal Kingdom|Expedition_Everest.jpg"
        "kilimanjaro|Kilimanjaro Safaris|Animal Kingdom|Kilimanjaro_Safaris.jpg"
        "escape-gringotts|Harry Potter and the Escape from Gringotts|Universal Studios|Escape_from_Gringotts.jpg"
        "revenge-mummy|Revenge of the Mummy|Universal Studios|Revenge_of_the_Mummy.jpg"
        "transformers|TRANSFORMERS The Ride-3D|Universal Studios|Transformers_The_Ride_3D.jpg"
        "hagrid|Hagrid's Magical Creatures Motorbike Adventure|Islands of Adventure|Hagrid's_Magical_Creatures_Motorbike_Adventure.jpg"
        "velocicoaster|Jurassic World VelociCoaster|Islands of Adventure|Jurassic_World_VelociCoaster.jpg"
        "spider-man|The Amazing Adventures of Spider-Man|Islands of Adventure|The_Amazing_Adventures_of_Spider-Man.jpg"
        "mako|Mako|SeaWorld|Mako_(roller_coaster).jpg"
        "kraken|Kraken|SeaWorld|Kraken_(roller_coaster).jpg"
        "atlantis|Journey to Atlantis|SeaWorld|Journey_to_Atlantis.jpg"
        "dragon|The Dragon|LEGOLAND|The_Dragon_(Legoland).jpg"
        "coastersaurus|Coastersaurus|LEGOLAND|Coastersaurus.jpg"
    )
    
    for ride_info in "${rides[@]}"; do
        IFS='|' read -r ride_id ride_name park_name commons_file <<< "$ride_info"
        
        if search_and_download "$ride_name" "$ride_id" "$park_name"; then
            ((success_count++))
        else
            # Try fallback to direct Commons filename
            log "Trying fallback Commons filename..."
            if download_from_commons "$ride_name" "$ride_id" "$commons_file"; then
                ((success_count++))
            else
                ((fail_count++))
            fi
        fi
        
        log "Sleeping ${SLEEP_TIME}s before next request..."
        sleep "$SLEEP_TIME"
        log ""
    done
    
    log "========================================"
    log "Download Complete!"
    log "Success: $success_count"
    log "Failed: $fail_count"
    log "Total: $((success_count + fail_count))"
    log "========================================"
}

# Run main function
main "$@"
