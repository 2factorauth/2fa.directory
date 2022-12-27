#!/usr/bin/env sh

# Generate content
echo "Generating content"
ruby scripts/generate_entries.rb &
ruby scripts/generate_regions.rb &
wait

# Build site
echo "Building static site"
hugo --minify -b $base

# Minify HTML
echo "Minifying HTML content"
for file in public/*/*.html; do
  html-minifier \
    --collapse-whitespace --remove-comments \
    --remove-script-type-attributes \
    -o "$file" "$file" &
done
wait
echo "Build complete"
