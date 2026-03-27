# Architecture

## Public Release Scope

This repository is a demo and research prototype. The architecture is organized to keep:

- synthetic data sources separate from handoff logic
- data access separate from algorithm logic
- public-review safety boundaries visible

The core release claim is architectural, not clinical deployment readiness.

## Overview

The repository is organized into four top-level domains:

- `frontend/`
  - browser-facing UI assets, runtime config, legacy demo assets, and design references
- `backend/`
  - canonical engine files, simulation logic, harness runtime, MCP runtime, and shared services
- `db/`
  - synthetic data sources, local seed data, public demo bundle output, and cache storage
- `api-server/`
  - local HTTP server, API handlers, Vercel routes, and server-side adapters

Compatibility entrypoints stay at the root:

- `index.html`
- `algorithm-demo.html`
- `api/*.js`

The harness runtime still loads browser-side engine files inside a VM sandbox so Node-based tests can validate summary behavior without a DOM or live UI.

## Main Components

- `backend/harness/runtime/createEngineSandbox.js`
  - minimal DOM-like environment for VM execution
- `backend/harness/runtime/loadHandoffEngineApi.js`
  - loads the canonical browser engine files through the path manifest and returns `handoffAppApi`
- `backend/harness/runtime/fetchFhirPatients.js`
  - fetches patient summaries/details through the API-server handler modules
- `backend/harness/runtime/loadLocalDemoPatients.js`
  - synthetic fixture loader for harness-only regression tests
- `backend/mcp/runtime/patientDataGateway.js`
  - stabilizes remote FHIR fetches with cache and fallback
- `backend/mcp/server/fhirMcpServer.js`
  - exposes patient list/detail tools over a local MCP transport
- `backend/mcp/client/fhirMcpClient.js`
  - connects Node-side callers to the MCP server
- `api-server/server/httpServer.js`
  - local static server and API multiplexer
- `tests/fixtures/`
  - golden synthetic patients and expectations

## Data Flow

1. A test or script loads the harness API.
2. The harness reads browser engine files into a VM sandbox.
3. Patient input comes from MCP-backed synthetic FHIR intake or harness-only synthetic fixtures.
4. The engine builds normalized timelines, longitudinal summaries, handoff analysis, and narrative SBAR HTML.
5. Tests assert on the resulting structured output or rendered HTML.

## MCP Data Flow

1. Browser or Node tooling calls `patients-mcp`.
2. `patients-mcp` tries the local MCP client first.
3. The MCP server calls `patientDataGateway`.
4. The gateway reads public synthetic FHIR data or file cache.
5. The resulting patient payload flows into the existing handoff engine unchanged.

## GitHub Pages + Remote Server Flow

1. GitHub Pages serves the static frontend.
2. The frontend reads `runtime-config.js`.
3. If `apiBase` is configured, the browser calls the remote Vercel server.
4. The remote server exposes `/api/patients-mcp`, `/api/patients`, and `/api/simulation`.
5. If no remote server is configured, the browser can still use same-origin `/api/patients-mcp` on Vercel.
6. If neither route exists, the UI keeps the MCP connection failure visible instead of loading a committed patient bundle.

## Structural Boundary

- Root HTML and root `api/*.js` files are compatibility shells, not the primary implementation surface.
- `backend/engine/handoff-engine.js` remains the canonical engine contract that UI and harness share.
- Reusable validation and automation helpers live under `backend/` plus `scripts/`.
- Live app runtime should depend on `patients-mcp` rather than local patient files.
- Tests should depend on `backend/harness/` instead of hand-rolled VM setup.
