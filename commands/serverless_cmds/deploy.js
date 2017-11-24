'use strict';
const CommandBase = require('../../utils/CommandBase');
const apiClient = require('./client/ServerlessClient');
const path = require('path');
const chalk = require('chalk').default;
const fs = require('fs');

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

  manifiest(yargs) {
    return yargs.option('v', {
      alias: 'verbose',
      describe: 'Make the operation more talkative',
    });
  }

  describe() {
    return 'Deploy ServerLess function to the configured stack';
  }

  callback(args) {
    return new Promise((resolve, reject) => {
      // GET THE URL FROM THE STACK
      this._getStackInfo()
        .then((info) => {
          try {
            //this.progressBar().show('collecting ingredients');

            // GET stack.yaml (where is the RC file)
            const rcPath = path.dirname(this.findUp(this.ENV('RCFILE')));
            const stackPath = `${rcPath}/${this.ENV('STACK_SERVERLESS_DEFINITION_NAME')}`;

            if (!fs.existsSync(stackPath)) {
              this.progressBar().clear();
              console.log('');
              console.log(chalk.red('Then main ingredient for the ramen is missing!'));
              console.log(chalk.italic.gray(`(psss... by the way,  you need to place the definition ${this.ENV('STACK_SERVERLESS_DEFINITION_NAME')} file in ${rcPath})`));
              console.log('');
              this.progressBar().fail();
              process.exit();
            }

            const stackDefinition = fs.readFileSync(stackPath).toString('utf8');
            const deploymentSettings = this.settings(true).deployment;

            if (args.verbose) {
              this.progressBar().clear();
              console.log(chalk.bold.blue(' Serverless Url:'), info.SERVERLESS_URL);
              console.log(chalk.bold.blue(' Stack Path:'), stackPath);
              console.log(chalk.bold.blue(' Stack Name:'), deploymentSettings.name);
              console.log('');
            }
            // DEPLOY STACK

            this.progressBar().show('preparing the special recipe...');

            const shell = require('shelljs');
            // Run external tool synchronously
            const cmd = shell.exec('make deploy');
            if (cmd.code == 0) {
              console.log('');
              this.progressBar().success();
            } else {
              this.progressBar().clear();
              this.errors().UnknowError(`${cmd.stdout} ${cmd.stderr}`);
              this.progressBar().fail();
              process.exit();
            }
          } catch (ex) {
            this.errors().UnknowError(ex);
          }
        }, (error) => {
          this.errors().UnknowError(error);
        });
    });
  }
}

// Find the Root Path
module.exports = new DeployCommand();
