'use strict';
const yargs = require('yargs');
const chalk = require('chalk').default;
const findUp = require('find-up');
const lodash = require('lodash');

const ENV = require('./utils/config/ConfigurationClient');
const renderer = require('./utils/templates/FileRenderer');
const YAML = require('./utils/templates/YamlRenderer');

// LOAD ENV FILE
require('dotenv').config({
  path: `${__dirname}/assets/.env`,
});

let config = require('./assets/defaults/default-rc.json');
const rcPath = findUp.sync([ENV.get('RCFILE')]);
try {
  if (rcPath) {
    config = lodash.defaultsDeep(YAML.fromYAMLFile(rcPath), config);
  }
} catch (ex) {
  console.log('');
  console.log(chalk.red(`ERROR: Failed to parse ${ENV.get('RCFILE')} file in the path ${rcPath}`));
  console.log('');
  throw ex;
}

// WELCOME BANNER
return yargs
  .commandDir('./commands')
  .config(config)
  .demandCommand()
  .recommendCommands()
  .usage(renderer.render('welcome.hbs', {
    WELCOME_EMOJI: require('node-emoji').get('ramen'),
  }))
  .help()
  .wrap(90)
  .argv;

