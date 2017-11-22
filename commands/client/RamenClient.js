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
   * @param {String} projectSettingPath Project Settings Path (for getting the path)
   */
  createRCFile(userSettings, projectSettingPath) {
    return new Promise((resolve, reject) => {
      const packagePath = projectSettingPath;
      const rcFile = `${packagePath}/${ENV.get('RCFILE')}`;
      fs.writeFileSync(rcFile, YAML.toYAML(userSettings));
      resolve(path.basename(rcFile));
    });
  };
};

const client = new RamenClient();
module.exports = client;
