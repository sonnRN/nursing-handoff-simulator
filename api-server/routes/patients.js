const { handler } = require("../handlers/patientsApi");
const { toVercelHandler } = require("../adapters/toVercelHandler");

module.exports = toVercelHandler(handler);
