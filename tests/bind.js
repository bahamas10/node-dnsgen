var dnsgen = require('../'),
    j = require('../example.json');

dnsgen.bind(j).pipe(process.stdout);
