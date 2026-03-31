#!/bin/bash
# Create blog posts in Sanity

TOKEN="skQUXzNOvcWakM2LokLf7LCcxBI2ooAQwIo0r9zIIQWDrQqBhYniPpeRFWnVFfn2XdMAqWwyqgCMPaSzskCDCM43Q2g3ASzR5AxEap7ypBPFOdvko7ajkDBLmDBSIsvY6yfAUUzQHKeAMcOO2FhmJHPa5kraCuFjSuv06XuuqvAcJIb3lxuj"
PROJECT="hd7qwtcq"
DATASET="production"
ENDPOINT="https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}"

# Function to create a blog post
create_post() {
  local slug="$1"
  local title="$2"
  local excerpt="$3"
  local body_json="$4"
  local read_time="$5"
  local category="$6"
  local tags="$7"

  local mutation=$(cat <<EOF
  {
    "create": {
      "_type": "blogPost",
      "title": $(echo "$title" | jq -Rs .),
      "slug": { "_type": "slug", "current": $(echo "$slug" | jq -Rs .) },
      "excerpt": $(echo "$excerpt" | jq -Rs .),
      "body": $body_json,
      "readTime": $read_time,
      "publishedAt": "2026-03-31T00:00:00Z",
      "categories": [{ "_type": "reference", "_ref": $category }],
      "tags": $tags,
      "author": { "name": "Plan Your Park Team" }
    }
  }
EOF
)
  echo "Creating: $title"
  result=$(curl -s -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"mutations\": [$mutation]}" 2>&1)
  echo "  Result: $result"
}

# First, create missing categories
echo "=== Creating categories ==="

create_category() {
  local slug="$1"
  local title="$2"
  echo "Creating category: $title"
  curl -s -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"mutations\":[{\"create\":{\"_type\":\"category\",\"title\":\"$title\",\"slug\":{\"_type\":\"slug\",\"current\":\"$slug\"}}}]}" 2>&1
}

# Check existing categories
echo "Checking existing categories..."
curl -s "https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=*%5B_type+%3D%3D+%27category%27%5D" \
  -H "Authorization: Bearer $TOKEN" 2>&1

echo ""
echo "=== Done ==="
