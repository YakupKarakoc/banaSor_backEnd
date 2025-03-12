const { createServer } = require("@vercel/node");
const app = require("./index");

module.exports = createServer(app);
