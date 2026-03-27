# API Server Agent Notes

- Start here for HTTP routing, request/response handling, CORS behavior, and Vercel route work.
- Prefer keeping transport concerns in this folder and shared business logic in `../backend/`.
- Update root `api/*.js` wrappers only when route files move or are renamed.
- Validate API-server changes with:
  - `node tests/http-server-smoke.js`
  - `node tests/simulation-api-smoke.js`
  - `node tests/vercel-adapter-smoke.js`
