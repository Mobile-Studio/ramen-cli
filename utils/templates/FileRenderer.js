'use strict';
const fs = require('fs');
const handlebars = require('handlebars');
const lodash = require('lodash');

/**
 * File Renderer Templating
 */
class FileRenderer {
  /**
   * Compile and return the renderer result
   * @param {String} fileOrPathFromAssets Path or file assuming the assets as base folder
   * @param {*} userContext Object with the values for the transpiling procces
   */
  render(fileOrPathFromAssets, userContext = {}) {
    const envVars = {};
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('RAMEN_')) {
        envVars[key] = process.env[key];
      }
    });
    const context = lodash.defaultsDeep(Object.assign({}, userContext), envVars);

    const file = fs.readFileSync(`${__dirname}/../../assets/${fileOrPathFromAssets}`).toString('utf8');
    return handlebars.compile(file)(context);
  }
};

const client = new FileRenderer();
module.exports = client;
