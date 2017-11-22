'use strict';
const CONFIG = require('./config/ConfigurationClient');
const findUp = require('find-up');
const chalk = require('chalk').default;
const inquirer = require('inquirer');
const YAML = require('./templates/YamlRenderer');
const Errors = require('./templates/ErrorRenderer');
const fs = require('fs');
const lodash = require('lodash');
const settings = require('./../utils/config/Settings');
const ora = require('ora');

/**
 * Command Base Class
 */
class CommandBase {
  /**
   * Command Identifier
   * @param {String} command Command Identifier Handle
   */
  constructor(command) {
    this.command = command;
    this.describe = this.describe();
    this.builder = (yargs) => {
      this.manifiest(yargs);
    };
    this.handler = (yargs) => {
      this.callback(yargs);
    };
  }

  /**
   * Get the Setting for the CLI in the RC file
   * @param {Boolean} checkIntegrity Check if the file is valid
   */
  settings(checkIntegrity) {
    return settings
      .getRcSettings(checkIntegrity);
  };

  /**
   * Get the Project Settings accord to the language (package.json for NodeJS)
   */
  getProjectSettings(verboseError) {
    return settings
      .getProjectSettings(verboseError);
  };

  /**
   * Find file in the execution path , and Up into the parent folder
   * @param {*} filename File Name to find
   */
  findUp(filename) {
    return findUp.sync(filename);
  }

  /**
   * GET Environment Variable
   * @param {*} name Name of the variable to get
   */
  ENV(name) {
    return CONFIG.get(name);
  }

  /**
   * YARGS Builder Handler
   */
  manifiest() {
    return (yargs) => { };
  }

  /**
   * Return the description for the command
   */
  describe() {
    throw new Error('You must override the \'describe\' method in order to use it');
  }

  /**
   * Handler for the Function
   * @param {*} args YARG Argument
   */
  callback(args) {
    throw new Error('You must override the \'handler\' method in order to use it');
  }

  /**
   * Progress Bar Utility
   */
  progressBar() {
    return {
      show: (msg) => {
        const message = (msg || 'Mixing all together with some spicy');
        if (!this.loaderUi) {
          this.loaderUi = ora({
            spinner: 'bouncingBar',
            color: 'blue',
          });
        }
        this.loaderUi.text = message;
        this.loaderUi.start();
      },
      fail: (msg) => {
        if (this.loaderUi) {
          const emoji = require('node-emoji').get('ramen');
          const message = chalk.red(msg ? `${msg} ${emoji}\n` : `We are sorry! ${emoji}\n`);
          this.loaderUi.fail(message);
        }
      },
      success: (msg) => {
        if (this.loaderUi) {
          const emoji = require('node-emoji').get('ramen');
          const message = chalk.green(msg ? `${msg} ${emoji}\n` : `Done! ${emoji}\n`);
          this.loaderUi.succeed(message);
        }
      },
      clear: () => {
        if (this.loaderUi) {
          this.loaderUi.stop();
          this.loaderUi.clear();
        }
      },
      update: (msg) => {
        if (this.loaderUi) {
          this.loaderUi.text = msg;
        }
      },
    };
  }

  /**
   * For Printing Nicely and friendly errors
   */
  errors() {
    return Errors;
  }
}

module.exports = CommandBase;
