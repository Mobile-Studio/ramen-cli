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

  describe() {
    return 'Deploy API projects to the configured stack';
  }

  callback(args) {
    console.log('- collecting ingredients.');
    this.progressBar().show();

    apiClient
      .deploy('http://localhost', 'stack', '')
      .then(() => {
        this.progressBar().close();
        process.exit();
      });
  }
}

// Find the Root Path
module.exports = new DeployCommand();
