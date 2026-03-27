const assert = require("assert");
const { chromium } = require("playwright");
const { startHttpServer } = require("../api-server/server/httpServer");

async function openSelector(page, port) {
  await page.goto(`http://127.0.0.1:${port}/?qa=1`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await page.click("main > section:first-of-type button[data-action='goto'][data-target='dashboard']");
  await page.waitForSelector(".selector-panel", { timeout: 5000 });
  await page.waitForTimeout(200);
}

async function enterDashboard(page, wardType, department) {
  await page.click(`[data-action='select-ward'][data-ward='${wardType}']`);
  await page.waitForTimeout(150);
  await page.click(`[data-action='select-department'][data-department='${department}']`);
  await page.waitForTimeout(150);
  await page.click(".selector-enter");
  await page.waitForTimeout(250);
}

async function main() {
  const { server, port } = await startHttpServer({ port: 0 });
  const browser = await chromium.launch({ headless: true });

  try {
    const generalPage = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await openSelector(generalPage, port);

    assert.strictEqual(await generalPage.locator("[data-action='select-department']").count(), 0);
    assert.strictEqual(await generalPage.locator(".selector-enter").getAttribute("aria-disabled"), "true");

    await generalPage.click("[data-action='select-ward'][data-ward='general']");
    await generalPage.waitForTimeout(150);
    assert.strictEqual(await generalPage.locator("[data-action='select-department']").count(), 5);
    assert.strictEqual(await generalPage.locator(".selector-enter").getAttribute("aria-disabled"), "true");

    await enterDashboard(generalPage, "general", "internal");
    assert.match(await generalPage.locator("aside h1").textContent(), /제4병동|Ward 4/);
    assert.ok(await generalPage.locator("body").textContent().then((text) => text.includes("Portable chest x-ray")));
    await generalPage.close();

    const icuPage = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await openSelector(icuPage, port);
    await icuPage.click("[data-action='select-ward'][data-ward='icu']");
    await icuPage.waitForTimeout(150);

    const icuDepartments = await icuPage.locator("[data-action='select-department']").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-department"))
    );

    assert.deepStrictEqual(icuDepartments.sort(), ["internal", "surgery"]);
    assert.strictEqual(await icuPage.locator(".selector-enter").getAttribute("aria-disabled"), "true");

    await enterDashboard(icuPage, "icu", "surgery");
    assert.match(await icuPage.locator("aside h1").textContent(), /중환자실|ICU/);
    assert.ok(await icuPage.locator("body").textContent().then((text) => text.includes("Massive transfusion cooler audit")));
    await icuPage.close();

    console.log("Stitch selector flow smoke test passed.");
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(`Stitch selector flow smoke test failed: ${error.message}`);
  process.exit(1);
});
