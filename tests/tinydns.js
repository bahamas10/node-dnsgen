var dnsgen = require('../'),
    j = require('../example.json');

dnsgen.tinydns(j).pipe(process.stdout);
