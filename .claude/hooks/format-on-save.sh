#!/bin/sh
set -eu

PROJECT_DIR=$(node -e 'let input=""; process.stdin.on("data", chunk => input += chunk).on("end", () => console.log(JSON.parse(input).cwd || "."))')
cd "$PROJECT_DIR"

npm run format
