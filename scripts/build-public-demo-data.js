const fs = require("fs");
const path = require("path");
const { FILE_PATHS } = require("../repo-paths");

const ROOT = path.resolve(__dirname, "..");
const CACHE_ROOT = FILE_PATHS.db.cache.fhirMcp;
const OUTPUT_DIR = FILE_PATHS.db.publicDemoDir;
const OUTPUT_FILE = FILE_PATHS.db.publicDemoBundle;

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function firstJsonFile(directory) {
  if (!fs.existsSync(directory)) return "";
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()[0] || "";
}

function findDetailFile(detailsDir, patientId) {
  const suffix = `${encodeURIComponent(patientId)}.json`;
  return fs.readdirSync(detailsDir)
    .filter((file) => file.endsWith(suffix))
    .sort()[0] || "";
}

function main() {
  const listDir = path.join(CACHE_ROOT, "lists");
  const detailsDir = path.join(CACHE_ROOT, "details");
  const listCacheName = firstJsonFile(listDir);

  if (!listCacheName) {
    throw new Error("FHIR list cache is missing. Warm the MCP gateway first.");
  }

  const listPayload = readJson(path.join(listDir, listCacheName));
  const patients = Array.isArray(listPayload.patients) ? listPayload.patients : [];

  if (!patients.length) {
    throw new Error("FHIR list cache did not contain any patients.");
  }

  const detailsById = {};

  for (const patient of patients) {
    const id = String(patient.id || "").trim();
    if (!id) continue;

    const detailFileName = findDetailFile(detailsDir, id);
    if (!detailFileName) {
      throw new Error(`FHIR detail cache is missing for patient ${id}`);
    }

    detailsById[id] = readJson(path.join(detailsDir, detailFileName));
  }

  const output = {
    source: "github-pages-public-demo-snapshot",
    generatedAt: new Date().toISOString(),
    policy: {
      syntheticOnly: true,
      safeForPublicDemo: true
    },
    patients,
    detailsById
  };

  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`Public demo bundle created: ${path.relative(ROOT, OUTPUT_FILE)}`);
  console.log(`Patient count: ${patients.length}`);
}

try {
  main();
} catch (error) {
  console.error(`Failed to build public demo bundle: ${error.message}`);
  process.exit(1);
}
