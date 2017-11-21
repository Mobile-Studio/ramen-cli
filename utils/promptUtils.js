'use strict';
const chalk = require('chalk').default;
const lodash = require('lodash');
const inquirer = require('inquirer');

var i = 4;
var loader = ['/ Installing.', '| Installing..', '\\ Installing...', '- Installing....'];
const loaderUi = new inquirer.ui.BottomBar({
  bottomBar: loader[i % 4],
});
/**
 * Output Message Rendered
 */
class PromptUtils {
  defaultLabel(value) {
    return chalk.italic.gray((value ? ` (${value})` : ''));
  }

  indexOf(arrayToFind, valueToFindInArray) {
    return lodash.indexOf(arrayToFind, valueToFindInArray);
  }

  progressBar() {
    return {
      show: () => {
        setInterval(() => {
          loaderUi.updateBottomBar(loader[i++ % 4]);
        }, 300);
      },
      close: (msg) => {
        const emoji = require('node-emoji').get('ramen');
        console.log('');
        loaderUi.updateBottomBar(chalk.green(msg ? `${msg} ${emoji}` : `Done! ${emoji}`));
        console.log('');
      },
      update: (msg) => {
        loaderUi.updateBottomBar(msg);
      },
    };
  }
};

const client = new PromptUtils();
module.exports = client;
