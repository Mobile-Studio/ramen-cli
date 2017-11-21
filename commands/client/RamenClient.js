'use strict';
const lodash = require('lodash');
const fs = require('fs');
const path = require('path');
const findUp = require('find-up');
const ENV = require('../../utils/config/ConfigurationClient');

class RamenClient {
  /**
   * Create an RC standard file in the root file of the project (where is the package.json)
   * @param {*} userSettings User Settings to override
   */
  createRCFile(userSettings) {
    return new Promise((resolve, reject) => {
      const settings = lodash.defaultsDeep({}, userSettings);

      const packagePath = path.dirname(findUp.sync(['package.json']));

      const rcFile = `${packagePath}/${ENV.get('RCFILE')}.json`;
      fs.writeFileSync(rcFile, JSON.stringify(settings, null, '  '));

      resolve(path.basename(rcFile));
    });
  };
};

const client = new RamenClient();
module.exports = client;
