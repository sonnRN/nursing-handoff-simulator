const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { startHttpServer } = require("../src/server/httpServer");

const CLIENT_PATH = path.resolve(
  process.env.USERPROFILE || process.env.HOME || "",
  ".codex",
  "skills",
  "develop-web-game",
  "scripts",
  "web_game_playwright_client.js"
);

const OUTPUT_ROOT = path.resolve(process.cwd(), "output", "web-game", "stitch-ui");

const NOOP_ACTIONS = JSON.stringify({
  steps: [{ buttons: [], frames: 1 }]
});

const RUNS = [
  {
    name: "landing",
    clickSelector: null,
    pauseMs: 400
  },
  {
    name: "dashboard",
    clickSelector: "button[data-action='goto'][data-target='dashboard']",
    pauseMs: 400
  },
  {
    name: "worklist",
    clickSelector: "button[data-action='goto'][data-target='worklist']",
    pauseMs: 400
  },
  {
    name: "emr",
    clickSelector: "button[data-action='goto'][data-target='emr']",
    pauseMs: 400
  },
  {
    name: "records",
    clickSelector: "button[data-action='goto'][data-target='records']",
    pauseMs: 400
  },
  {
    name: "demo-feedback",
    clickSelector: "button[data-action='run-demo-session']",
    pauseMs: 5200
  }
];

function runClient(run, port) {
  const args = [
    CLIENT_PATH,
    "--url",
    `http://localhost:${port}/?qa=1`,
    "--actions-json",
    NOOP_ACTIONS,
    "--iterations",
    "1",
    "--pause-ms",
    String(run.pauseMs),
    "--screenshot-dir",
    path.join(OUTPUT_ROOT, run.name)
  ];

  if (run.clickSelector) {
    args.push("--click-selector", run.clickSelector);
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      stdio: "inherit"
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Playwright client failed for ${run.name} with exit code ${code}`));
    });
  });
}

async function main() {
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  const { server, port } = await startHttpServer({ port: 8787 });
  try {
    for (const run of RUNS) {
      process.stdout.write(`\n[validate-stitch-ui] ${run.name}\n`);
      await runClient(run, port);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
