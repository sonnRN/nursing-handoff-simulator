# Backend Agent Notes

- Start here for engine logic, simulation scoring, MCP behavior, and harness changes.
- Keep `engine/` stable because both the browser app and the harness load it.
- Prefer updating shared harness helpers before duplicating VM or data-loading logic in tests.
- Validate structural backend changes with:
  - `npm test`
  - `node tests/mcp-runtime-wiring-smoke.js`
  - `node tests/emr-render-smoke.js`
