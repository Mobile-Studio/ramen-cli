'use strict';
const CommandBase = require('../../utils/CommandBase');
const apiClient = require('./client/ApiClient');
/**
 * Deploy Command
 */
class DeployCommand extends CommandBase {
  constructor() {
    super('deploy');
  }

  _getStackInfo() {
    return new Promise((resolve, reject) => {
      const JsonInfo = require('./../../assets/stubbies/ENV_CONFIG.json');
      const stack = this.settings(true).stack;
      resolve(JsonInfo[stack.company][stack.environment]);
    });
  }

  describe() {
    return 'Deploy API projects to the configured stack';
  }

  deployStack(deployerUrl, stackName, definition) {
    this.progressBar().show();
    apiClient
      .deploy(deployerUrl, stackName, definition)
      .then(() => {
        this.progressBar().close();
        process.exit();
      });
  }

  callback(args) {
    return new Promise((resolve, reject) => {
      // GET THE URL FROM THE STACK
      this._getStackInfo()
        .then((info) => {
          console.log('- collecting ingredients.');

          this.deployStack(this.DEPLOYER_URL, this.packageJSON().name);
        }, (error) => {
          this.errors().UnknowError(error);
        });
    });
  }
}

// Find the Root Path
module.exports = new DeployCommand();
