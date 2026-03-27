# DB Agent Notes

- Start here for local synthetic data, fallback seeds, cache location changes, and bundle output work.
- Keep all data synthetic and public-safe.
- If cache structure changes, update both `repo-paths.js` and any scripts/tests that read cache files.
- Validate data-side changes with:
  - `node scripts/build-public-demo-data.js`
  - `node tests/public-demo-bundle-smoke.js`
  - `node tests/synthea-source-smoke.js`
