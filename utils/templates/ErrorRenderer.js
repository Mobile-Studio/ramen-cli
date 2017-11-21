'use strict';
const fs = require('fs');
const handlebars = require('handlebars');

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
    console.log(`Oops!, invalid choice: [${userChoice}]`.red);
    if (validChoices.length > 0) {
      console.log(`Valid choices are: <${validChoices.join('|')}>`.blue);
    }
    console.log('');
  }

  /**
   * Print a Unknow Error in the console
   * @param {*} error Unknow Error
   */
  UnknowError(error) {
    console.log('');
    console.log('Oops!, An error has ocurred:'.red);
    console.error(error);
    console.log('');
  }
};

const client = new ErrorRenderer();
module.exports = client;
