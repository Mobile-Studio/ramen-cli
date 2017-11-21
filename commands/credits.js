'use strict';
const fs = require('fs');
const colors = require('colors');

exports.command = 'credits';
exports.describe = 'Get the contributors you should invite to lunch!';

exports.handler = (argv) => {
  // https://manytools.org/hacker-tools/convert-images-to-ascii-art/go
  const banner = fs.readFileSync(`${__dirname}/../assets/banner.txt`).toString('utf-8');
  console.log(banner.yellow);
};
