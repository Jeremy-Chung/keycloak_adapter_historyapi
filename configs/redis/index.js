/**
 * redis config
 */
const { NODE_ENV } = process.env;
const configFileName = `./${ NODE_ENV }.js`;
const config = require.call(null, configFileName);

module.exports = config;
