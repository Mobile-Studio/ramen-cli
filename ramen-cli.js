'use strict';
const yargs = require('yargs');
const chalk = require('chalk').default;
const findUp = require('find-up');
const fs = require('fs');
const ENV = require('./utils/config/ConfigurationClient');
const renderer = require('./utils/templates/FileRenderer');

// LOAD ENV FILE
require('dotenv').config({
  path: `${__dirname}/assets/.env`,
});

let config = {};
const configPath = findUp.sync([ENV.get('RCFILE'), `${ENV.get('RCFILE')}.json`]);
try {
  if (configPath) {
    config = JSON.parse(fs.readFileSync(configPath));
  }
} catch (ex) {
  console.log('');
  console.log(chalk.red(`ERROR: Failed to parse ${ENV.get('RCFILE')} file in the path ${configPath}`));
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

