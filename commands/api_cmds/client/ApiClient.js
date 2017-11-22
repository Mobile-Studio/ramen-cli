'use strict';
const lodash = require('lodash');
const YAML = require('./../../../utils/templates/YamlRenderer');
const request = require('request');
/**
 * API Client
 */
class ApiClient {
  /**
   * Deploy the API in the selected stack, guided by the YML definition
   * @param {*} deployerURL Deployer API URL to command the cluster
   * @param {*} stackName Stack Identifier in the cluster
   * @param {*} stackYMLDefinition Docker Stack in YML format
   */
  deploy(deployerURL, stackName, stackYMLDefinition) {
    const jsonStack = YAML.fromYAML(stackYMLDefinition);
    return new Promise((resolve, reject) => {
      // Call to the API
      request({
        method: 'POST',
        uri: `${deployerURL}/${stackName}`,
        json: jsonStack,
        strictSSL: false, // TODO: Check for other solution
      }, (error, response, body) => {
        // has some error??
        if (error) {
          return reject(error);
        }

        // If 201 is created
        if (response.statusCode == 200) {
          resolve({
            response: response,
            body: body,
          });
        } else {
          reject({
            response: response,
            body: body,
          });
        }
      });
    });
  }
};

const client = new ApiClient();
module.exports = client;
