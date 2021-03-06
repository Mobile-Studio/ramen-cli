'use strict';
const CommandBase = require('../utils/CommandBase');

/**
 * API Command
 */
class ApiCommand extends CommandBase {
  // Constructor
  constructor() {
    super('api <command>');
  }

  manifiest(yargs) {
    // Return the sub commands for the parent
    return yargs
      .commandDir('api_cmds');
  }

  describe() {
    return 'Manage Api projects';
  }

  callback(args) {
    return (argv) => { };
  }
}

module.exports = new ApiCommand();
