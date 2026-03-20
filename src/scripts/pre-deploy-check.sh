#!/bin/bash
# PlanYourPark Pre-Deploy Check
# Usage: bash scripts/pre-deploy-check.sh [PREVIEW_URL]
# Run from repo root

cd "$(dirname "$0")/.."

ERRORS=0
WARNINGS=0

echo "🏰 PlanYourPark Pre-Deploy Check"
echo "================================"
echo ""

# 1. Broken internal link references
echo "📎 Checking internal link references..."
BROKEN_LINKS=0
for f in *.html blog/*.html; do
  [ -f "$f" ] || continue
  grep -oE 'href="(/[^"#?]*)"' "$f" 2>/dev/null | sed 's/href="//;s/"//' | while read url; do
    if [[ "$url" == */ ]]; then
      # Directory reference — check for index.html
      [ ! -f ".${url}index.html" ] && echo "  BROKEN in $(basename $f): $url" && BROKEN_LINKS=$((BROKEN_LINKS+1))
    else
      [ ! -f ".${url}" ] && [ ! -f ".${url}.html" ] && echo "  BROKEN in $(basename $f): $url"
    fi
  done
done
echo ""

# 2. Image reference check
echo "🖼️  Checking image references..."
MISSING_IMAGES=0
# Check HTML src attributes
for f in *.html blog/*.html; do
  [ -f "$f" ] || continue
  grep -oE 'src="([^"]*\.(jpg|jpeg|webp|png))"' "$f" 2>/dev/null | sed 's/src="//;s/"//' | while read img; do
    if [[ "$img" == http* ]]; then
      continue  # Skip external URLs
    elif [[ "$img" == /* ]]; then
      [ ! -f ".${img}" ] && echo "  MISSING in $(basename $f): $img"
    else
      dir=$(dirname "$f")
      [ ! -f "${dir}/${img}" ] && echo "  MISSING in $(basename $f): $img"
    fi
  done
done

# Check JS image references (app.js park images)
echo "  Checking app.js park images..."
grep -oE "image: '[^']+'" app.js 2>/dev/null | sed "s/image: '//;s/'//" | while read img; do
  [ ! -f "$img" ] && echo "  MISSING park image: $img"
done

# Check ride-images.js
echo "  Checking ride image mappings..."
grep -oE "'/images/rides/[^']+'" scripts/ride-images.js 2>/dev/null | sed "s/'//g" | while read img; do
  [ ! -f ".${img}" ] && echo "  MISSING ride image: $img"
done
echo ""

# 3. JS syntax check
echo "🔧 Checking inline JS syntax..."
node -e "
const fs = require('fs');
let errors = 0;
['index.html','park.html','rides.html','character-dining.html','deals.html'].forEach(f => {
  try {
    const html = fs.readFileSync(f,'utf8');
    const scripts = html.match(/<script>[\s\S]*?<\/script>/g) || [];
    scripts.forEach((s,i) => {
      try { new Function(s.replace(/<\/?script>/g,'')); }
      catch(e) { console.log('  ERROR in ' + f + ' script ' + i + ': ' + e.message); errors++; }
    });
  } catch(e) { /* file doesn't exist */ }
});
if (errors === 0) console.log('  All inline scripts OK');
process.exit(errors > 0 ? 1 : 0);
" || ERRORS=$((ERRORS+1))
echo ""

# 4. Affiliate link check
echo "💰 Checking affiliate links..."
UNTAGGED=$(grep -rn "amazon.com/dp" blog/*.html 2>/dev/null | grep -v "planyourpark-20" | wc -l | tr -d ' ')
if [ "$UNTAGGED" -gt 0 ]; then
  echo "  WARNING: $UNTAGGED Amazon links missing planyourpark-20 tag"
  grep -rn "amazon.com/dp" blog/*.html | grep -v "planyourpark-20"
  WARNINGS=$((WARNINGS+1))
else
  TAGGED=$(grep -rn "planyourpark-20" blog/*.html 2>/dev/null | wc -l | tr -d ' ')
  echo "  All Amazon links tagged ($TAGGED links across blog posts)"
fi
echo ""

# 5. Required files check
echo "📁 Checking required files..."
for f in index.html park.html rides.html character-dining.html deals.html blog/index.html \
         styles/global-nav.css scripts/global-nav.js scripts/ride-images.js scripts/ride-modal.js \
         app.js netlify.toml; do
  [ ! -f "$f" ] && echo "  MISSING: $f" && ERRORS=$((ERRORS+1))
done
echo "  Core files present"
echo ""

# 6. Duplicate ride images
echo "🎢 Checking for duplicate ride images..."
DUPES=$(shasum images/rides/*.jpg 2>/dev/null | awk '{print $1}' | sort | uniq -c | sort -rn | awk '$1 > 1 {print}' | wc -l | tr -d ' ')
if [ "$DUPES" -gt 0 ]; then
  echo "  WARNING: $DUPES sets of duplicate ride images found"
  WARNINGS=$((WARNINGS+1))
else
  TOTAL=$(ls images/rides/*.jpg 2>/dev/null | wc -l | tr -d ' ')
  echo "  All $TOTAL ride images are unique"
fi
echo ""

# 7. Image size check
echo "📏 Checking image sizes..."
LARGE=$(find images/rides -name "*.jpg" -size +500k 2>/dev/null | wc -l | tr -d ' ')
if [ "$LARGE" -gt 0 ]; then
  echo "  WARNING: $LARGE ride images over 500KB"
  find images/rides -name "*.jpg" -size +500k -exec ls -lh {} \; | awk '{print "  " $5 " " $9}'
  WARNINGS=$((WARNINGS+1))
else
  echo "  All ride images under 500KB"
fi
echo ""

# Summary
echo "================================"
echo "Results: $ERRORS errors, $WARNINGS warnings"
if [ "$ERRORS" -gt 0 ]; then
  echo "❌ FAIL — fix errors before deploying"
  exit 1
else
  echo "✅ PASS — ready for manual review"
  exit 0
fi
