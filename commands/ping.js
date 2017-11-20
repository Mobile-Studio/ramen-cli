// my-module.js
exports.command = 'ping'
exports.aliases = ['ping']
exports.describe = 'Play Ping Pong with the CLI'

exports.builder = {
  response: {
    default: 'cool'
  }
}

exports.handler = function (argv) {
  console.log("pong");
}