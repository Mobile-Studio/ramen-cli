'use strict';
const fs = require('fs');
const chalk = require('chalk');
const CommandBase = require('../utils/CommandBase');

/**
 * Credits Command
 */
class CreditsCommand extends CommandBase {
  constructor() {
    super('credits');
  }

  describe() {
    return 'Get the contributors you should invite to lunch!';
  }

  callback(args) {
    // https://manytools.org/hacker-tools/convert-images-to-ascii-art/go
    const banner = fs.readFileSync(`${__dirname}/../assets/banner.hbs`).toString('utf-8');
    console.log(chalk.yellow(banner));
  }
}

// Find the Root Path
module.exports = new CreditsCommand();

