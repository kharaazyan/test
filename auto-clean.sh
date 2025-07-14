#!/bin/bash

# Auto-clean script for CLI-NetSecTool
# Removes temporary files and build artifacts

set -e

echo "🧹 Cleaning temporary files..."

# Remove build artifacts
rm -rf build/*

# Remove cache
rm -rf cache/*

# Remove temporary files
find . -name "*.tmp" -delete
find . -name "*.log" -delete
find . -name "*.o" -delete

# Remove deps (temporary directory)
rm -rf deps/*

echo "✅ Cleanup completed"
