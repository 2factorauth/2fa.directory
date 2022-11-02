#!/usr/bin/env sh
./generate_entries.rb
./generate_regions.rb
hugo --minify
