'use strict';
const CONFIG = require('./config/ConfigurationClient');
const findUp = require('find-up');
const chalk = require('chalk').default;
const inquirer = require('inquirer');
const YAML = require('./templates/YamlRenderer');
const fs = require('fs');
const lodash = require('lodash');

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

  settings() {
    try {
      const rcPath = this.findUp(this.ENV('RCFILE'));
      const config = lodash.defaultsDeep(
        rcPath ? YAML.fromYAMLFile(rcPath) : {},
        require(`${__dirname}/../assets/defaults/default-rc.json`)
      );

      return config;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
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
      close: (msg) => {
        const emoji = require('node-emoji').get('ramen');
        this.loaderUi.updateBottomBar(chalk.green(msg ? `\n${msg} ${emoji}\n` : `\nDone! ${emoji}\n`));
      },
      update: (msg) => {
        this.loaderUi.updateBottomBar(msg);
      },
    };
  }
}

module.exports = CommandBase;
