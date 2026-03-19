Original prompt: [$develop-web-game](C:\\Users\\gse06\\.codex\\skills\\develop-web-game\\SKILL.md) You are a senior full-stack engineer using the `develop-web-game` skill to build a serious, interactive web simulation.

## Current status

- Cloned `https://github.com/sonnRN/AI-handoff.git` into the workspace.
- Confirmed the repo is a plain HTML/CSS/JS frontend with a Node HTTP/API server, plus a substantial canonical handoff engine in `handoff-engine.js`.
- Confirmed the OpenAI docs MCP server is not available in the active session even after registration; implementation will use official OpenAI docs as the reference source and keep a strong local fallback path.

## Architecture notes

- Preserve:
  - `handoff-engine.js` as the longitudinal summary / prioritization core.
  - Node API surface and deployment shape under `src/server` and `api/`.
  - Existing static-app deployment model.
- Refactor:
  - Replace the current multi-patient dashboard UI with a single-scenario state-machine simulation.
  - Add explicit simulation states, modern voice-product UX, and test hooks (`render_game_to_text`, `advanceTime`).
  - Add server endpoints for transcription / AI follow-up / feedback with a no-key fallback.

## Planned implementation

- Add one rich synthetic multi-day inpatient case tailored for nursing handoff synthesis.
- Build a modern EMR review screen with trends, medication changes, notes, and pending tasks.
- Add microphone flow with OpenAI transcription when configured, browser STT/manual correction fallback otherwise.
- Add AI receiver follow-up questions and structured feedback generation with deterministic fallback scoring.
- Serve the app from the local Node server so `npm start` runs the full MVP.

## Completed work

- Added `src/simulation/scenario.js` with a single telemetry patient scenario spanning five hospital days.
- Added `src/simulation/evaluator.js` for deterministic coverage scoring, follow-up question selection, and final feedback generation.
- Added `src/server/handlers/simulationApi.js` and `src/server/services/openaiSimulationService.js`.
- Added `api/simulation.js` for Vercel-compatible simulation routing.
- Updated `src/server/httpServer.js` to serve the browser app from `/` and accept `POST /api/simulation`.
- Rebuilt `index.html`, `style.css`, and `script.js` into a state-based single-scenario simulator.
- Added QA-only automation helpers and `render_game_to_text` / `advanceTime`.
- Added `tests/simulation-api-smoke.js` and expanded server smoke coverage to the root HTML shell.
- Rewrote `README.md` with MVP-specific run instructions, OpenAI config notes, QA guidance, and known limitations.

## Validation run

- Passed:
  - `node tests/http-server-smoke.js`
  - `node tests/simulation-api-smoke.js`
  - `node tests/mcp-runtime-wiring-smoke.js`
  - `node tests/vercel-adapter-smoke.js`
- Passed Playwright-based screenshot/state validation using the `develop-web-game` client with elevated browser execution.
- `npm test` was started but did not complete within the timeout window because the legacy suite is broad and long-running.

## Remaining notes

- OpenAI transcription/AI grading paths still need a real `OPENAI_API_KEY` for live validation.
- The learner-facing experience is the new `index.html`; the legacy algorithm demo is still present for reference only.

## Stitch UI migration

- Pulled the Google Stitch project screens for `간호 인수인계 대시보드` and used them as the required UI reference.
- Replaced the prior custom app shell with a Stitch-aligned structure:
  - `index.html` now loads the Stitch/Tailwind shell and hands rendering to:
    - `stitch-ui-marketing.js`
    - `stitch-ui-clinical.js`
    - `stitch-app.js`
- Kept the existing simulation logic but rewired it into the Stitch layout:
  - landing
  - briefing
  - EMR review
  - recording
  - transcript confirmation
  - AI follow-up
  - final feedback
- Added `scripts/validate-stitch-ui.js` plus `npm run test:browser:stitch-ui` so the app can be validated through the `develop-web-game` Playwright client without needing a manually managed server process.

## Stitch UI validation

- Passed:
  - `node tests/http-server-smoke.js`
  - `node tests/simulation-api-smoke.js`
  - `npm run test:browser:stitch-ui`
- Playwright artifacts were captured under `output/web-game/stitch-ui/`.
- Verified state captures for:
  - `landing`
  - `briefing`
  - `emr`
  - `record`
  - `feedback`
- Verified a full button-driven in-browser flow with direct Playwright:
  - landing -> briefing -> emr -> trends tab -> prior date -> record -> demo transcript -> AI follow-up -> final feedback
  - final state:
    - `step: feedback`
    - `selectedDate: 2026-03-17`
    - `emrTab: trends`
    - `transcriptReady: true`
    - `followupQuestions: 3`
    - `followupAnswers: 3`
    - `feedbackReady: true`

## Stitch-specific fixes

- Fixed a shared-asset merge bug between `stitch-ui-marketing.js` and `stitch-ui-clinical.js` that caused `src="undefined"` and broken avatar/patient images in the EMR/report screens.
- The remaining console output during browser validation is only the Node warning from the external skill script being reparsed as ESM; there are no app-side 404 errors in the current run.

## Stitch 6-screen alignment

- Confirmed the Stitch project currently has 7 screens total, but 1 is a prototype/mobile variant and the implementation target is the 6 desktop screens:
  - landing
  - dashboard
  - worklist
  - simulation
  - report
  - learning records
- Downloaded the canonical Stitch HTML exports into `stitch-assets/screens/` for direct comparison.
- Added `stitch-ui-admin.js` and rewired `stitch-app.js` so the app now exposes all 6 top-level Stitch-aligned screens:
  - `landing` -> Stitch landing
  - `dashboard` -> ward dashboard / case launch
  - `worklist` -> patient list / session list
  - `emr` + recording flow -> simulation shell
  - `feedback` -> result report
  - `records` -> learning records and stats
- The mobile Stitch prototype was intentionally not counted in the implementation target.

## Updated validation

- Updated `scripts/validate-stitch-ui.js` so browser validation now captures:
  - `landing`
  - `dashboard`
  - `worklist`
  - `emr`
  - `records`
  - `demo-feedback`
- Verified the captured state files under `output/web-game/stitch-ui/`:
  - `landing.state-0.json` -> `step: landing`
  - `dashboard.state-0.json` -> `step: dashboard`
  - `worklist.state-0.json` -> `step: worklist`
  - `emr.state-0.json` -> `step: emr`
  - `records.state-0.json` -> `step: records`
  - `demo-feedback.state-0.json` -> `step: feedback`
- Verified one full direct browser flow:
  - landing -> dashboard -> worklist -> emr -> trends tab -> prior date -> record -> demo transcript -> AI follow-up -> feedback
  - final state:
    - `step: feedback`
    - `selectedDate: 2026-03-17`
    - `emrTab: trends`
    - `transcriptReady: true`
    - `followupQuestions: 3`
    - `followupAnswers: 3`
  - `feedbackReady: true`
  - `historyCount: 4`

## Follow-up UI fixes

- Treat Stitch MCP and the Stitch project screens as the UI source of truth for further changes.
- Updated QA affordance so the `QA MODE` pill stays visible, but the `QA tools` panel only appears on hover/focus.
- Increased admin-screen top spacing and made the desktop side navigation scrollable so the dashboard header/menu no longer clips at the top.
- Kept the Stitch clinical simulation shell but remapped the left mini rail so the four visible icons now navigate to real app sections:
  - dashboard
  - worklist
  - emr
  - records
- Updated `scripts/validate-stitch-ui.js` to hover the QA trigger before navigation, then move the cursor away before screenshots so captured states match the default UI.
- Revalidated:
  - `node tests/http-server-smoke.js`
  - `node tests/simulation-api-smoke.js`
  - `npm run test:browser:stitch-ui`
  - direct Playwright check confirming left-rail navigation reaches `dashboard`, `worklist`, and `records` from the simulation screen.
