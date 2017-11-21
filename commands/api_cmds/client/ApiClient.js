'use strict';
const lodash = require('lodash');

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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('deployed stack!');
      }, 4000);
    });
  }
};

const client = new ApiClient();
module.exports = client;
