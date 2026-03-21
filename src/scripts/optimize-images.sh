#!/bin/bash
# Optimize blog images for web performance
# Converts PNGs to WebP and creates responsive sizes

BLOG_DIR="/root/.openclaw/workspace/orlando-park-guide/blog"
QUALITY_WEBP=85
MAX_WIDTH=1200

echo "🔧 Optimizing blog images..."
echo ""

# Create optimized directory
mkdir -p "$BLOG_DIR/optimized"

# Process each PNG
for img in "$BLOG_DIR"/*.png; do
    [ -e "$img" ] || continue
    
    filename=$(basename "$img" .png)
    echo "Processing: $filename.png"
    
    # Create WebP version (main optimization)
    cwebp -q $QUALITY_WEBP -resize $MAX_WIDTH 0 "$img" -o "$BLOG_DIR/${filename}.webp"
    
    # Get file sizes for comparison
    orig_size=$(stat -c%s "$img")
    webp_size=$(stat -c%s "$BLOG_DIR/${filename}.webp")
    
    # Calculate savings
    savings=$((orig_size - webp_size))
    percent=$((savings * 100 / orig_size))
    
    orig_mb=$(echo "scale=2; $orig_size / 1024 / 1024" | bc)
    webp_mb=$(echo "scale=2; $webp_size / 1024 / 1024" | bc)
    
    echo "  Original: ${orig_mb}MB → WebP: ${webp_mb}MB (${percent}% smaller)"
    echo ""
done

echo "✅ Optimization complete!"
echo ""
echo "Next steps:"
echo "1. Update HTML files to use .webp with .png fallback"
echo "2. Commit and deploy"
