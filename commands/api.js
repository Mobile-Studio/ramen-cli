'use strict';
exports.command = 'api <command>';
exports.desc = 'Manage Api projects';
exports.builder = (yargs) => {
  return yargs.commandDir('api_cmds');
};
exports.handler = (argv) => { };
