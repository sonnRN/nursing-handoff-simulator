const path = require("path");

const ROOT = __dirname;
const FRONTEND_DIR = path.join(ROOT, "frontend");
const BACKEND_DIR = path.join(ROOT, "backend");
const DB_DIR = path.join(ROOT, "db");
const API_SERVER_DIR = path.join(ROOT, "api-server");

const FILE_PATHS = {
  frontend: {
    rootShells: {
      index: path.join(ROOT, "index.html"),
      algorithmDemo: path.join(ROOT, "algorithm-demo.html")
    },
    pages: {
      index: path.join(FRONTEND_DIR, "pages", "index.html"),
      algorithmDemo: path.join(FRONTEND_DIR, "pages", "algorithm-demo.html"),
      prototype: path.join(FRONTEND_DIR, "design", "index.frontend-skill.html")
    },
    config: {
      runtime: path.join(FRONTEND_DIR, "config", "runtime-config.js"),
      runtimeExample: path.join(FRONTEND_DIR, "config", "runtime-config.example.js")
    },
    ui: {
      styles: {
        main: path.join(FRONTEND_DIR, "ui", "styles", "style.css"),
        clearcare: path.join(FRONTEND_DIR, "ui", "styles", "clearcare-ui.css")
      },
      stitchApp: path.join(FRONTEND_DIR, "ui", "stitch-app.js"),
      stitchUiAdmin: path.join(FRONTEND_DIR, "ui", "stitch-ui-admin.js"),
      stitchUiClinical: path.join(FRONTEND_DIR, "ui", "stitch-ui-clinical.js"),
      stitchUiMarketing: path.join(FRONTEND_DIR, "ui", "stitch-ui-marketing.js"),
      stitchUiSelector: path.join(FRONTEND_DIR, "ui", "stitch-ui-selector.js"),
      uiHotfix: path.join(FRONTEND_DIR, "ui", "ui-hotfix.js")
    },
    legacy: {
      script: path.join(FRONTEND_DIR, "legacy", "script.js"),
      algorithmDemoStyles: path.join(FRONTEND_DIR, "legacy", "algorithm-demo.css"),
      algorithmDemoScript: path.join(FRONTEND_DIR, "legacy", "algorithm-demo.js")
    },
    design: {
      stitchAssetsDir: path.join(FRONTEND_DIR, "design", "stitch-assets")
    },
    output: {
      root: path.join(FRONTEND_DIR, "output"),
      stitchUi: path.join(FRONTEND_DIR, "output", "web-game", "stitch-ui")
    }
  },
  backend: {
    engine: {
      handoff: path.join(BACKEND_DIR, "engine", "handoff-engine.js"),
      stage2: path.join(BACKEND_DIR, "engine", "stage2-overrides.js"),
      stage2Period: path.join(BACKEND_DIR, "engine", "stage2-period-overrides.js")
    },
    simulation: {
      scenario: path.join(BACKEND_DIR, "simulation", "scenario.js"),
      evaluator: path.join(BACKEND_DIR, "simulation", "evaluator.js")
    },
    harness: {
      dir: path.join(BACKEND_DIR, "harness")
    },
    mcp: {
      dir: path.join(BACKEND_DIR, "mcp"),
      client: {
        fhirMcpClient: path.join(BACKEND_DIR, "mcp", "client", "fhirMcpClient.js")
      },
      runtime: {
        patientDataGateway: path.join(BACKEND_DIR, "mcp", "runtime", "patientDataGateway.js")
      },
      serverEntry: path.join(BACKEND_DIR, "mcp", "server", "fhirMcpServer.js")
    },
    services: {
      openaiSimulation: path.join(BACKEND_DIR, "services", "openaiSimulationService.js")
    }
  },
  db: {
    dataDir: path.join(DB_DIR, "data"),
    syntheaDir: path.join(DB_DIR, "data", "synthea"),
    syntheaFhirDir: path.join(DB_DIR, "data", "synthea", "fhir"),
    publicDemoDir: path.join(DB_DIR, "public-demo-data"),
    publicDemoBundle: path.join(DB_DIR, "public-demo-data", "patients-bundle.json"),
    seeds: {
      patients: path.join(DB_DIR, "seeds", "patients.js")
    },
    cache: {
      dir: path.join(DB_DIR, ".cache"),
      fhirMcp: path.join(DB_DIR, ".cache", "fhir-mcp")
    }
  },
  apiServer: {
    dir: API_SERVER_DIR,
    server: {
      httpServer: path.join(API_SERVER_DIR, "server", "httpServer.js"),
      buildInfo: path.join(API_SERVER_DIR, "server", "buildInfo.js")
    },
    adapters: {
      toVercelHandler: path.join(API_SERVER_DIR, "adapters", "toVercelHandler.js")
    },
    handlers: {
      patients: path.join(API_SERVER_DIR, "handlers", "patientsApi.js"),
      patientsMcp: path.join(API_SERVER_DIR, "handlers", "patientsMcpApi.js"),
      patientSourceResolver: path.join(API_SERVER_DIR, "handlers", "patientSourceResolver.js"),
      simulation: path.join(API_SERVER_DIR, "handlers", "simulationApi.js"),
      syntheaPatients: path.join(API_SERVER_DIR, "handlers", "syntheaPatientsApi.js")
    },
    routes: {
      health: path.join(API_SERVER_DIR, "routes", "health.js"),
      patients: path.join(API_SERVER_DIR, "routes", "patients.js"),
      patientsMcp: path.join(API_SERVER_DIR, "routes", "patients-mcp.js"),
      simulation: path.join(API_SERVER_DIR, "routes", "simulation.js")
    },
    logsDir: path.join(API_SERVER_DIR, "logs")
  }
};

const ENGINE_BROWSER_FILES = [
  { filename: "script.js", absolutePath: FILE_PATHS.frontend.legacy.script },
  { filename: "handoff-engine.js", absolutePath: FILE_PATHS.backend.engine.handoff },
  { filename: "stage2-overrides.js", absolutePath: FILE_PATHS.backend.engine.stage2 },
  { filename: "stage2-period-overrides.js", absolutePath: FILE_PATHS.backend.engine.stage2Period }
];

module.exports = {
  ROOT,
  FRONTEND_DIR,
  BACKEND_DIR,
  DB_DIR,
  API_SERVER_DIR,
  FILE_PATHS,
  ENGINE_BROWSER_FILES
};
