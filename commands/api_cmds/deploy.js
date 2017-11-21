'use strict';
const ENV = require('../../utils/config/ConfigurationClient');

exports.command = 'deploy';
exports.describe = 'Deploy API projects to the configured stack';

exports.handler = (argv) => {
  console.log(argv);
};
