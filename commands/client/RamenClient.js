'use strict';
const lodash = require('lodash');
const fs = require('fs');
const path = require('path');
const findUp = require('find-up');
const ENV = require('../../utils/config/ConfigurationClient');
const YAML = require('./../../utils/templates/YamlRenderer');
const defaultJsonRC = require('./../../assets/defaults/default-rc.json');

class RamenClient {
  /**
   * Create an RC standard file in the root file of the project (where is the package.json)
   * @param {*} userSettings User Settings to override
   */
  createRCFile(userSettings) {
    return new Promise((resolve, reject) => {
      console.log(defaultJsonRC);
      const settings = lodash.defaultsDeep({
        stack: userSettings,
      }, defaultJsonRC);

      const packagePath = path.dirname(findUp.sync(['package.json']));
      const rcFile = `${packagePath}/${ENV.get('RCFILE')}`;
      fs.writeFileSync(rcFile, YAML.toYAML(settings));

      resolve(path.basename(rcFile));
    });
  };
};

const client = new RamenClient();
module.exports = client;
