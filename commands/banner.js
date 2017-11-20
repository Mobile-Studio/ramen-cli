const fs = require('fs');
const colors = require('colors');

exports.command = 'banner'
exports.aliases = ['banner','hungry']
exports.describe = 'Get the super cool awesome ramen ready for eat!'

exports.handler = function (argv) {
  // https://manytools.org/hacker-tools/convert-images-to-ascii-art/go
  const banner = fs.readFileSync(`${__dirname}/../assets/banner.txt`).toString('utf-8');
  console.log(banner.yellow);
}