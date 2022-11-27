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
--remove-script-type-attributes --remove-tag-whitespace \
--use-short-doctype -o "$file" "$file" &
done
wait
