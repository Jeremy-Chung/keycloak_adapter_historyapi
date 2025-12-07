/**
 * Provide different keycloak by env
 */
const { NODE_ENV } = process.env;
const configFileName = `./${ NODE_ENV }.json`;
const config = require.call(null, configFileName);

module.exports = config;
