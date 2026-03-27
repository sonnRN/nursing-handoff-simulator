const { handler } = require("../handlers/patientsMcpApi");
const { toVercelHandler } = require("../adapters/toVercelHandler");

module.exports = toVercelHandler(handler);
