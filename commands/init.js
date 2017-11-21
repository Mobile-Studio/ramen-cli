'use strict';
const inquirer = require('inquirer');

const ENV = require('../utils/config/ConfigurationClient');
const renderer = require('../utils/templates/FileRenderer');
const errors = require('../utils/templates/ErrorRenderer');
const promptUtils = require('./../utils/promptUtils');
const client = require('./client/RamenClient');

const MANIFIEST = {
  'company': {
    name: 'company',
    list: ENV.get('CONFIG_COMPANIES_AVAILABLES').split(','),
  },
  'environment': {
    name: 'environment',
    list: ENV.get('CONFIG_CLUSTERS_AVAILABLES').split(','),
  },
};

exports.command = 'init';
exports.desc = `Interactively create a ${ENV.get('RCFILE')} file`;
exports.builder = (yargs) => {
  return yargs.commandDir('api_cmds');
};
exports.handler = (argv) => {
  return new Promise((resolve, reject) => {
    // PROMPT MAIN QUESTION'S!
    const promptConfigurationQuestions = () => {
      return new Promise((resolve, reject) => {
        const prompts = [];

        // COMPANY SELECTION
        prompts.push({
          type: 'list',
          name: MANIFIEST.company.name,
          message: `What\'s is the company you contribute for? ${promptUtils.defaultLabel(argv[MANIFIEST.company.name])}`,
          choices: MANIFIEST.company.list,
          default: promptUtils.indexOf(MANIFIEST.company.list, argv[MANIFIEST.company.name]),
        });

        // ENVIRONMENT SELECTION
        prompts.push({
          type: 'list',
          name: MANIFIEST.environment.name,
          message: `In what staging you want to work? ${promptUtils.defaultLabel(argv[MANIFIEST.environment.name])}`,
          choices: MANIFIEST.environment.list,
          default: promptUtils.indexOf(MANIFIEST.environment.list, argv[MANIFIEST.environment.name]),
        });

        inquirer
          .prompt(prompts)
          .then(resolve);
      });
    };

    promptConfigurationQuestions()
      .then((answers) => {
        // Is Correct??
        inquirer.prompt({
          name: 'confirm',
          message: renderer.render('app-init/confirm.hbs', answers),
          default: 'Y',
        })
          .then((result) => {
            // Confirm
            const match = (new RegExp(/y|yes/ig));
            if (match.test(result.confirm.toLowerCase())) {
              promptUtils.progressBar().show();

              // Create a RC file standar, to keep specific configuration!
              client
                .createRCFile(answers)
                .then((file) => {
                  promptUtils.progressBar().close(`Configuration saved in ${file}`);
                  process.exit();
                }, (err) => {
                  errors.UnknowError(err);
                });
            } else {
              errors.InvalidChoice(result.confirm, ['y', 'yes']);
            }
          });
      });
  });
};
