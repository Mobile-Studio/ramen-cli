'use strict';
const lodash = require('lodash');
const YAML = require('./../../../utils/templates/YamlRenderer');
const request = require('request');
/**
 * API Client
 */
class ServerlessClient {
  /**
   * Deploy the Serverlesss in the selected stack, guided by the YML definition
   * @param {*} deployerURL Deployer API URL to command the cluster
   * @param {*} stackName Stack Identifier in the cluster
   * @param {*} stackYMLDefinition Docker Stack in YML format
   */
  deploy(deployerURL, stackName, stackYMLDefinition) {
    const jsonStack = YAML.fromYAML(stackYMLDefinition);
    return new Promise((resolve, reject) => {
      // Call to the API
    });
  }
};

const client = new ServerlessClient();
module.exports = client;
