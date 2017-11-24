'use strict';
const CommandBase = require('../utils/CommandBase');

/**
 * Server Less Command
 */
class ServerLessCommand extends CommandBase {
  // Constructor
  constructor() {
    super('serverless <command>');
  }

  manifiest(yargs) {
    // Return the sub commands for the parent
    return yargs
      .commandDir('serverless_cmds');
  }

  describe() {
    return 'Manage Serverless functions';
  }

  callback(args) {
    return (argv) => { };
  }
}

module.exports = new ServerLessCommand();
