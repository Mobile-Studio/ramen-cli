'use strict';
const lodash = require('lodash');

class RamenClient {
  /**
   * Create an RC standard file in the root file of the project (where is the package.json)
   * @param {*} userSettings User Settings to override
   */
  createRCFile(userSettings) {
    return new Promise((resolve, reject) => {
      const settings = lodash.defaultsDeep({}, userSettings);

      resolve(userSettings);
    });
  };
};

const client = new RamenClient();
module.exports = client;
