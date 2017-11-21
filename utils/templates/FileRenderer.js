'use strict';
const fs = require('fs');
const handlebars = require('handlebars');

/**
 * File Renderer Templating
 */
class FileRenderer {
  /**
   * Compile and return the renderer result
   * @param {String} fileOrPathFromAssets Path or file assuming the assets as base folder
   * @param {*} context Object with the values for the transpiling procces
   */
  render(fileOrPathFromAssets, context = {}) {
    const file = fs.readFileSync(`${__dirname}/../../assets/${fileOrPathFromAssets}`).toString('utf8');
    return handlebars.compile(file)(context);
  }
};

const client = new FileRenderer();
module.exports = client;
