#!/bin/sh
set -e

npm ci

# Turbopack resolves CSS @imports from app/; symlink so packages in /app/node_modules resolve.
ln -sfn /app/node_modules /app/app/node_modules

exec "$@"
