'use strict';
const yargs = require('yargs');
const findUp = require('find-up');
const fs = require('fs');
const ENV = require('./utils/config/ConfigurationClient');
const renderer = require('./utils/templates/FileRenderer');

// LOAD ENV FILES
require('dotenv').config();

const configPath = findUp.sync([ENV.get('RCFILE'), `${ENV.get('RCFILE')}.json`]);
const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {};

// WELCOME BANNER
;
return yargs
  .commandDir('./commands')
  .config(config)
  .demandCommand()
  .recommendCommands()
  .usage(renderer.render('welcome.txt', {
    CLI_DOC_URL: ENV.get('CLI_DOC_URL'),
    CLI_FULLNAME: ENV.get('CLI_FULLNAME'),
    CLI_COMMAND_ROOT: ENV.get('CLI_COMMAND_ROOT'),
  }))
  .help()
  .wrap(90)
  .argv;

