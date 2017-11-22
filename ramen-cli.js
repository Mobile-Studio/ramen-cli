'use strict';
const yargs = require('yargs');
const chalk = require('chalk').default;

const ENV = require('./utils/config/ConfigurationClient');
const renderer = require('./utils/templates/FileRenderer');
const settings = require('./utils/config/Settings');

// LOAD ENV FILE
require('dotenv').config({
  path: `${__dirname}/assets/.env`,
});

let config = null;
try {
  config = settings.getRcSettings();
} catch (ex) {
  throw ex;
}

try {
  return yargs
    .config(config)
    .commandDir('./commands')
    .demandCommand()
    .recommendCommands()
    .usage(renderer.render('welcome.hbs', {
      WELCOME_EMOJI: require('node-emoji').get('ramen'),
    }))
    .help()
    .wrap(90)
    .argv;
} catch (ex) {
  console.log('');
  console.log(chalk.red('ERROR: Failed to run the CLI'));
  console.log(chalk.gray.italic(`(frecuently is a bad format in the ${ENV.get('RCFILE')})`));
  console.log('');
  throw ex;
}

