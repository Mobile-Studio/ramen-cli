'use strict';
const CommandBase = require('./../utils/CommandBase');
const inquirer = require('inquirer');
const chalk = require('chalk');
const lodash = require('lodash');
const path = require('path');

const renderer = require('../utils/templates/FileRenderer');
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

  /**
   * Create a initial RC File for CLI
   * @param {*} stackData Stack Answers for data
   */
  createRCFile(stackData) {
    return new Promise((resolve, reject) => {
      // Create a RC file standar, to keep specific configuration!
      let defaultRC = require('./../assets/defaults/default-rc.json');
      let projectSettings = {};

      try {
        projectSettings = this.getProjectSettings(false);
      } catch (ex) {
        if (ex.type !== 'PROJECT_SETTINGS_INEXISTENCE') {
          throw ex;
        }

        // DEFAULT MINIMAL SETTINGS
        projectSettings = {
          settingsPath: process.cwd(),
          name: path.basename(process.cwd()),
          version: '1.0.0',
        };
      }

      // SET INITIAL CONFIGURATION
      const rcData = lodash.defaultsDeep({
        // Stack Configuration
        stack: stackData,
        // Deployment Configuration for Deployer
        deployment: {
          name: projectSettings.name,
          version: projectSettings.version,
        },
      }, defaultRC);

      client
        .createRCFile(rcData, projectSettings.settingsPath)
        .then((file) => {
          resolve(file);
        }, (err) => {
          reject(err);
        });
    });
  }

  callback(args) {
    return new Promise((resolve, reject) => {
      // PROMPT MAIN QUESTION'S!
      try {
        const promptConfigurationQuestions = () => {
          return new Promise((resolve, reject) => {
            try {
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
            } catch (ex) {
              this.errors().UnknowError(ex);
              throw ex;
            }
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

                  this
                    .createRCFile(answers)
                    .then((file) => {
                      this.progressBar().success(`Ramen recipe saved in ${file}`);
                      process.exit();
                    }, (err) => {
                      console.error(err);
                      this.progressBar().fail();
                      process.exit();
                    });
                } else {
                  this.errors().InvalidChoice(result.confirm, ['y', 'yes']);
                }
              });
          });
      } catch (ex) {
        this.errors().UnknowError(ex);
        throw ex;
      }
    });
  }
}

module.exports = new InitCommand();
