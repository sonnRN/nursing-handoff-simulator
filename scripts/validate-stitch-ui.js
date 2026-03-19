const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { startHttpServer } = require("../src/server/httpServer");

const OUTPUT_ROOT = path.resolve(process.cwd(), "output", "web-game", "stitch-ui");

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

async function captureRun(browser, port, run) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });
  const errors = [];
  const outDir = path.join(OUTPUT_ROOT, run.name);

  fs.mkdirSync(outDir, { recursive: true });

  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await page.goto(`http://localhost:${port}/?qa=1`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  if (run.clickSelector) {
    await page.hover(".qa-trigger");
    await page.waitForTimeout(150);
    await page.click(run.clickSelector, { timeout: 5000 });
    await page.mouse.move(1200, 40);
  }

  await page.waitForTimeout(run.pauseMs);

  const state = await page.evaluate(() => {
    if (typeof window.render_game_to_text === "function") {
      return window.render_game_to_text();
    }
    return "";
  });

  fs.writeFileSync(path.join(outDir, "state-0.json"), state);
  await page.screenshot({
    path: path.join(outDir, "shot-0.png"),
    type: "png",
    fullPage: true
  });

  if (errors.length) {
    fs.writeFileSync(path.join(outDir, "errors-0.json"), JSON.stringify(errors, null, 2));
  }

  await page.close();
}

async function main() {
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });

  const { server, port } = await startHttpServer({ port: 8787 });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const run of RUNS) {
      process.stdout.write(`\n[validate-stitch-ui] ${run.name}\n`);
      await captureRun(browser, port, run);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
