'use strict';
const CommandBase = require('./../utils/CommandBase');
const inquirer = require('inquirer');
const chalk = require('chalk');
const lodash = require('lodash');

const renderer = require('../utils/templates/FileRenderer');
const errors = require('../utils/templates/ErrorRenderer');
const client = require('./client/RamenClient');

class InitCommand extends CommandBase {
  constructor() {
    super('init');
  }

  /**
   * Get Custom Vars
   */
  vars() {
    if (!this._vars) {
      this._vars = {
        'company': {
          name: 'company',
          list: this.ENV('CONFIG_COMPANIES_AVAILABLES').split(','),
        },
        'environment': {
          name: 'environment',
          list: this.ENV('CONFIG_CLUSTERS_AVAILABLES').split(','),
        },
      };
    }

    return this._vars;
  }

  describe() {
    return `Interactively create a ${this.ENV('RCFILE')} file`;
  }

  callback(args) {
    return new Promise((resolve, reject) => {
      // PROMPT MAIN QUESTION'S!
      const promptConfigurationQuestions = () => {
        return new Promise((resolve, reject) => {
          const prompts = [];

          const defaultLabel = (collection) => {
            const value = this.settings().stack[collection.name];
            return chalk.italic.gray((value ? ` (${value})` : ''));
          };

          const getSelectedIndex = (collection) => {
            const valueToFind = this.settings().stack[collection.name];
            return lodash.indexOf(collection.list, valueToFind);
          };

          // COMPANY SELECTION
          prompts.push({
            type: 'list',
            name: this.vars().company.name,
            message: `What\'s is the company you contribute for? ${defaultLabel(this.vars().company)}`,
            choices: this.vars().company.list,
            default: getSelectedIndex(this.vars().company),
          });

          // ENVIRONMENT SELECTION
          prompts.push({
            type: 'list',
            name: this.vars().environment.name,
            message: `In what staging you want to work? ${defaultLabel(this.vars().environment)}`,
            choices: this.vars().environment.list,
            default: getSelectedIndex(this.vars().environment),
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
                this.progressBar().show();

                // Create a RC file standar, to keep specific configuration!
                client
                  .createRCFile(answers)
                  .then((file) => {
                    this.progressBar().close(`Recipe saved in ${file}`);
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
  }
}

module.exports = new InitCommand();
