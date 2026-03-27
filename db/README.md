# DB

This folder owns synthetic data, local seeds, demo bundles, and cache storage.

## What Lives Here

- `data/`
  - source synthetic datasets such as Synthea fixtures
- `seeds/`
  - local seed files used for fallback and harness work
- `public-demo-data/`
  - generated public-safe bundle output
- `.cache/`
  - local cache files used by the MCP gateway

## Useful Commands

- `node scripts/build-public-demo-data.js`
- `node tests/public-demo-bundle-smoke.js`
- `node tests/synthea-source-smoke.js`
