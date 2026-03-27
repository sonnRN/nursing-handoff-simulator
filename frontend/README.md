# Frontend

This folder owns browser-facing assets and design references.

## What Lives Here

- `ui/`
  - active app UI modules and styles
- `legacy/`
  - preserved algorithm demo assets and older browser helpers
- `config/`
  - runtime config files served to the browser
- `design/`
  - design references, stitched artifacts, and prototype captures
- `pages/`
  - organized copies of the root compatibility pages

## Entry Points

- Root `/index.html` loads assets from this folder.
- Root `/algorithm-demo.html` loads legacy assets from this folder.

## Useful Commands

- `npm start`
- `node scripts/validate-stitch-ui.js`
- `node tests/stitch-selector-flow-smoke.js`
