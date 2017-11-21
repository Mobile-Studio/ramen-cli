'use strict';
const fs = require('fs');
const chalk = require('chalk');

exports.command = 'credits';
exports.describe = 'Get the contributors you should invite to lunch!';

exports.handler = (argv) => {
  // https://manytools.org/hacker-tools/convert-images-to-ascii-art/go
  const banner = fs.readFileSync(`${__dirname}/../assets/banner.hbs`).toString('utf-8');
  console.log(chalk.yellow(banner));
};
