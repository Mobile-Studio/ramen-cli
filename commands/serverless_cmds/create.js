'use strict';
const CommandBase = require('../../utils/CommandBase');
const apiClient = require('./client/ServerlessClient');
const path = require('path');
const chalk = require('chalk').default;
const fs = require('fs');

/**
 * Create Command
 */
class CreateCommand extends CommandBase {
  constructor() {
    super('create');
  }
  manifiest(yargs) {
    return yargs.option('v', {
      alias: 'verbose',
      describe: 'Make the operation more talkative',
    });
  }

  describe() {
    return 'Configure a new ServerLess function';
  }

  callback(args) {
    return new Promise((resolve, reject) => {
      // GET THE URL FROM THE STACK

      this.progressBar().show('collecting ingredients');
      setTimeout(() => {
        this.progressBar().success('Comming Soon... ');
        process.exit();
      }, 2000);
    });
  }
}

// Find the Root Path
module.exports = new CreateCommand();
