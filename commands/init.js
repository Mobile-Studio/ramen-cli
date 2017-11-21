'use strict';
const inquirer = require('inquirer');
const ENV = require('../utils/config/ConfigurationClient');
const renderer = require('../utils/templates/FileRenderer');
const errors = require('../utils/templates/ErrorRenderer');
const client = require('./client/RamenClient');
const colors = require('colors');

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
          name: 'company',
          message: 'What\'s is the company you contribute for?',
          choices: ENV.get('CONFIG_COMPANIES_AVAILABLES').split(','),
        });

        // ENVIRONMENT SELECTION
        prompts.push({
          type: 'list',
          name: 'environment',
          message: 'In what staging you want to work?',
          choices: ENV.get('CONFIG_CLUSTERS_AVAILABLES').split(','),
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
          message: renderer.render('app-init/confirm.txt', answers),
          default: 'Y',
        })
          .then((result) => {
            // Confirm
            const match = (new RegExp(/y|yes/ig));
            if (match.test(result.confirm.toLowerCase())) {
              // Create a RC file standar, to keep specific configuration!
              client
                .createRCFile(answers)
                .then((file) => {

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
