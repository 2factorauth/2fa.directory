#!/usr/bin/env sh
# Generate content
./generate_entries.rb &
./generate_regions.rb &
wait
# Build site
hugo --minify

# Minify HTML
for file in public/*/*.html; do
html-minifier \
--collapse-whitespace --remove-comments \
--remove-script-type-attributes \
-o "$file" "$file" &
done
wait
