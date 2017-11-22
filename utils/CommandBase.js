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
    this.builder = this.builder();
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
  builder() {
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
        if (!this.loaderUi) {
          const message = (msg || 'Mixing all together with some spicy');
          this.i = 4;
          this.loader = [`\n/ ${message}.\n`, `\n| ${message}..\n`, `\n\\ ${message}...\n`, `\n- ${message}....\n`];
          this.loaderUi = new inquirer.ui.BottomBar({
            bottomBar: this.loader[this.i % 4],
          });
        }
        setInterval(() => {
          this.loaderUi.updateBottomBar(this.loader[this.i++ % 4]);
        }, 300);
      },
      fail: (msg) => {
        const emoji = require('node-emoji').get('ramen');
        this.loaderUi.updateBottomBar(chalk.green(msg ? `\n${msg} ${emoji}\n` : `\nWe are sorry! ${emoji}\n`));
      },
      close: (msg) => {
        const emoji = require('node-emoji').get('ramen');
        this.loaderUi.updateBottomBar(chalk.green(msg ? `\n${msg} ${emoji}\n` : `\nDone! ${emoji}\n`));
      },
      update: (msg) => {
        this.loaderUi.updateBottomBar(msg);
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
