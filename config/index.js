var fs = require('fs');
var _ = require('lodash');

var config = require('./all');
const ENVIRONMENT_FILE = __dirname + '/' + process.env.NODE_ENV + '.js';

// Merge with ENV file if exits.
if (fs.existsSync(ENVIRONMENT_FILE)) {
  const env = require(ENVIRONMENT_FILE);

  config = _.mergeWith(config, env);
}

module.exports = config;
