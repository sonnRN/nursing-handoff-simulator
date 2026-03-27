# API Server

This folder owns HTTP entrypoints, handler routing, and server adapters.

## What Lives Here

- `server/`
  - local Node HTTP server and build info
- `handlers/`
  - request handlers for patient and simulation APIs
- `routes/`
  - Vercel route implementations
- `adapters/`
  - serverless adapter helpers
- `logs/`
  - local server log files

## Notes

- Root `api/*.js` files are thin compatibility wrappers for Vercel-style routes.
- The local server still serves static assets from the repository root so compatibility shells keep working.

## Useful Commands

- `npm start`
- `node tests/http-server-smoke.js`
- `node tests/vercel-adapter-smoke.js`
