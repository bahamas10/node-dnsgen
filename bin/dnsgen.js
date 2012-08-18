#!/usr/bin/env node

var dnsgen = require('../'),
    path = require('path'),
    util = require('util'),
    version = require('../package.json').version,
    supported_types = ['bind', 'tinydns'];

/**
 * Usage
 *
 * return the usage message
 */
function usage() {
  return util.format([
    'Usage: %s type [ reverse ]',
    '',
    'Generate DNS files using json',
    '',
    'Options',
    '  --help    | -h: Print this help message and exit',
    '  --version | -v: Print the version number and exit',
    '',
    'Example',
    '  dnsgen bind reverse < dns.json',
    '',
    'Supported Types',
    '  [%s]'
  ].join('\n'), path.basename(process.argv[1]), supported_types);
}

// Command line arguments
switch (process.argv[2]) {
  case '-h': case '--help':
    console.log(usage());
    process.exit(0);
    break;
  case '-v': case '--version':
    console.log(version);
    process.exit(0);
    break;
}

var type = process.argv[2],
    reverse = process.argv[3];

// Get the json from stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');
var body = '';
process.stdin.on('data', function(chunk) {
  body += chunk;
});
process.stdin.on('end', function() {
  // Parse it
  try {
    var j = JSON.parse(body);
  } catch (e) {
    console.error('Failed to parse input JSON');
    console.error(e.stack);
    process.exit(1);
  }
  // Generate the correct format
  switch (type) {
    case 'bind':
      var func = (reverse === 'reverse') ? dnsgen.bindReverse : dnsgen.bind;
      func.call(dnsgen, j).pipe(process.stdout);
      break;
    case 'tiny': case 'tinydns':
      dnsgen.tinydns(j).pipe(process.stdout);
      break;
    default:
      console.error('Type not supported\n');
      console.error(usage());
      process.exit(2);
      break;
  }
});
