var dnsgen = require('../'),
    j = require('../example.json');

dnsgen.bindReverse(j).pipe(process.stdout);
