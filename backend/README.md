# Backend

This folder owns the shared logic that is not itself an HTTP entrypoint.

## What Lives Here

- `engine/`
  - canonical handoff engine and stage augmentation files
- `simulation/`
  - scenario data and deterministic evaluation logic
- `harness/`
  - VM sandbox and reusable test helpers
- `mcp/`
  - local MCP client, runtime, and server
- `services/`
  - shared backend service integrations such as OpenAI simulation helpers

## Useful Commands

- `npm test`
- `npm run test:stage2`
- `npm run test:fhir:smoke`
- `npm run test:fhir:batch`
