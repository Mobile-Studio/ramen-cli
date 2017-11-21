'use strict';
const fs = require('fs');

const lodash = require('lodash');
const yaml = require('js-yaml');

/**
 * Yaml Renderer Templating
 */
class YamlRenderer {
  /**
   * Compile and return the yaml result
   * @param {String} JsonObject Object to convert to YAML
   */
  toYAML(JsonObject) {
    return yaml.safeDump(JsonObject);
  }

  /**
   * Compile and return a JSON Object representation for the YAML
   * @param {*} yamlText YAML definition
   */
  fromYAML(yamlText) {
    var doc = yaml.safeLoad(yamlText);
    return doc;
  }

  /**
   * Compile and return a JSON Object representation for the YAML file
   * @param {*} yamlPath Path for the YAML Path
   */
  fromYAMLFile(yamlPath) {
    var doc = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
    return doc;
  }
};

const client = new YamlRenderer();
module.exports = client;
