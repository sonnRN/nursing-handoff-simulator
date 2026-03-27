const fs = require("fs");
const vm = require("vm");
const { createEngineSandbox } = require("./createEngineSandbox");
const { ROOT, ENGINE_BROWSER_FILES } = require("../../../repo-paths");

const ENGINE_FILES = ENGINE_BROWSER_FILES.map((file) => file.filename);

function loadHandoffEngineApi(options = {}) {
  const sandbox = createEngineSandbox(options);
  vm.createContext(sandbox);

  for (const file of ENGINE_BROWSER_FILES) {
    const content = fs.readFileSync(file.absolutePath, "utf8");
    vm.runInContext(content, sandbox, { filename: file.filename });
  }

  return {
    api: sandbox.window.handoffAppApi,
    sandbox
  };
}

module.exports = {
  loadHandoffEngineApi,
  ROOT,
  ENGINE_FILES
};
