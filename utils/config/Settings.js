'use strict';
const YAML = require('./../templates/YamlRenderer');
const lodash = require('lodash');
const findUp = require('find-up');
const chalk = require('chalk').default;
const fs = require('fs');
const path = require('path');
const ENV = require('./ConfigurationClient');

class Settings {
  /**
     * Get the Setting for the CLI in the RC file
     * @param {Boolean} checkIntegrity Check if the file is valid
     */
  getRcSettings(checkIntegrity) {
    let config = require('./../../assets/defaults/default-rc.json');
    const rcPath = findUp.sync(ENV.get('RCFILE'));

    if (!rcPath) {
      return config;
    }

    try {
      config = lodash.defaultsDeep(
        rcPath ? YAML.fromYAMLFile(rcPath) : {},
        config
      );
    } catch (ex) {
      console.log('');
      console.log(chalk.red(`ERROR: Failed to parse ${ENV.get('RCFILE')} file in the path ${rcPath}`));
      console.log('');
      throw ex;
    }

    if (checkIntegrity) {
      const invalids = [];

      // CHECK FOR THE REQUIRED VARIABLE
      if (!config.stack) {
        invalids.push('stack');
      }
      if (!config.stack.company) {
        invalids.push('stack.company');
      }
      if (!config.stack.environment) {
        invalids.push('stack.environment');
      }

      if (!config.deployment) {
        invalids.push('deployment');
      }
      if (!config.deployment.name) {
        invalids.push('deployment.name');
      }
      if (!config.deployment.version) {
        invalids.push('deployment.version');
      }

      if (invalids.length > 0) {
        invalids.forEach((field) => {
          console.log(chalk.red(` Undefined variable \'${field}\' in ${ENV.get('RCFILE')}`));
        });
        console.info(chalk.italic.gray('  (maybe you need to run init method to configure your stack)'));
        throw new Error('Integrity check failed');
      }
    }

    return config;
  }

  /**
  * Get the Project Settings accord to the language (package.json for NodeJS)
  */
  getProjectSettings(verboseError = true) {
    const fileName = 'package.json';
    const settingsPath = findUp.sync(fileName);
    if (!settingsPath) {
      const err = new Error('Project Settings is inexistence');
      err.type = 'PROJECT_SETTINGS_INEXISTENCE';
      if (verboseError) {
        // can't fail, wee need something to hook...
        console.log('');
        console.log(chalk.red('project settings file not found in the project path'));
        console.log(chalk.italic.gray('(you need run the setup command for any project type availables in the CLI)'));
        console.log('');
      }

      throw err;
    }

    const config = JSON.parse(fs.readFileSync(settingsPath));

    // Return an abstract configuration settings (for abstraction)
    return {
      name: config.name,
      version: config.version,
      settingsPath: path.dirname(settingsPath),
    };
  };
}

const client = new Settings();
module.exports = client;
