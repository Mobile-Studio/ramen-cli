var yargs = require('yargs');

yargs
  .commandDir('./commands')
  .demandCommand()
  .help()
  .argv

