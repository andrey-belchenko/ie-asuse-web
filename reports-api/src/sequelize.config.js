require("ts-node/register");
const config = require('./config.ts').default;

module.exports = {
  username: config.username,
  password: config.password,
  database: config.database,
  host: config.host,
  port: config.port,
  dialect: config.dialect,
};
