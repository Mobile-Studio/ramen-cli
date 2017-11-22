'use strict';
const fs = require('fs');
const handlebars = require('handlebars');
const chalk = require('chalk').default;

/**
 * Output Message Rendered
 */
class ErrorRenderer {
  /**
   * Print a nice error message
   * @param {String} userChoice User Choice
   * @param {Array<String>} validChoices A valid Choices
   */
  InvalidChoice(userChoice, validChoices = []) {
    console.log('');
    console.log(chalk.red(`Oops!, invalid choice: [${userChoice}]`));
    if (validChoices.length > 0) {
      console.log(chalk.blue(`Valid choices are: <${validChoices.join('|')}>`));
    }
    console.log('');
  }

  /**
   * Print a Unknow Error in the console
   * @param {*} error Unknow Error
   */
  UnknowError(error) {
    console.log('');
    console.log(chalk.red('Oops!, An error has ocurred:'));
    console.error(error);
    console.log('');
  }
};

const client = new ErrorRenderer();
module.exports = client;
