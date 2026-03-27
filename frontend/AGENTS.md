# Frontend Agent Notes

- Start here for UI, styling, browser event flow, and design-reference work.
- Prefer editing `ui/` for the learner-facing app and `legacy/` for the algorithm demo.
- Do not move API handler logic or data bundles into this folder.
- Root HTML files are compatibility shells. If page assets move, update the shell imports too.
- Validate UI-facing changes with:
  - `node scripts/validate-stitch-ui.js`
  - `node tests/stitch-selector-flow-smoke.js`
