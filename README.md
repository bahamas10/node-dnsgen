DNS Generator
=============

Generate DNS files using json

Install
------

Install the command line tool `dnsgen`

    npm install -g dnsgen

Install locally to use as a module

    npm install dnsgen

Usage
-----

Command line

    dnsgen bind reverse < example.json

As a module

``` js
var dnsgen = require('dnsgen');
```

Example
-------

### Command line tool

The command line tool reads json from stdin, and pipes the output to stdout

    $ dnsgen bind < example.json
    ; Bind file for example.com (10.0.0.0/23)
    @	IN	SOA	ns1.example.com.	admin.example.com. (
        2012081701	; serial
        28800	; refresh
        7200	; retry
        864000	; expire
        86400	; ttl
    )
    example.com.	IN	NS	ns1.example.com.
    example.com.	IN	NS	ns2.example.com.
    gw	IN	A	10.0.0.1
    zelda	IN	A	10.0.0.2	; Testing Box
    link	IN	A	10.0.0.3	; Another box for testing
    gw2	IN	A	10.0.1.1

You can also generate reverse lookup files

    $ dnsgen bind reverse < example.json
    ; Bind file for example.com (10.0.0.0/23)
    @	IN	SOA	ns1.example.com.	admin.example.com. (
        2012081701	; serial
        28800	; refresh
        7200	; retry
        864000	; expire
        86400	; ttl
    )
        IN	NS	ns1.example.com.
        IN	NS	ns2.example.com.
    0.1	IN	PTR	gw.example.com.
    0.2	IN	PTR	zelda.example.com.	; Testing Box
    0.3	IN	PTR	link.example.com.	; Another box for testing
    1.1	IN	PTR	gw2.example.com.

Tiny dns is also cool

    $ dnsgen tinydns < example.json
    # tinydns file for example.com (10.0.0.0/23)
    Zexample.com:ns1.example.com:admin.example.com:2012081701:28800:7200:864000
    &example.com::ns1.example.com:86400
    &example.com::ns2.example.com:86400
    =gw:10.0.0.1
    =zelda:10.0.0.2	# Testing Box
    =link:10.0.0.3	# Another box for testing
    =gw2:10.0.1.1

### Node Module

The exports of dnsgen return a stream that you can pipe anywhere you want

``` js
var dnsgen = require('dnsgen'),
    json = require('./example.json');

// Generate forward lookup file
dnsgen.bind(json).pipe(process.stdout);

// Generate reverse lookup file
dnsgen.bindReverse(json).pipe(process.stdout);

// Generate tinydns config
dnsgen.tinydns(json).pipe(process.stdout);
```

### example.json

``` json
{
  "domain": "example.com",
  "admin": "admin.example.com",
  "time": {
    "refresh": 28800,
    "retry": 7200,
    "expire": 864000,
    "ttl": 86400
  },
  "ns": [
    "ns1.example.com",
    "ns2.example.com"
  ],
  "netmask": "10.0.0.0/23",
  "hosts": {
    "10.0.0.1": "gw",
    "10.0.0.2": {
      "name": "zelda",
      "comment": "Testing Box"
    },
    "10.0.0.3": {
      "name": "link",
      "comment": "Another box for testing"
    },
    "10.0.1.1": "gw2"
  }
}
```

Tests
-----

    npm test

Known Limitations
-----------------

* This module only supports outputting files suitable for BIND and tiny DNS servers.
* Only A, NS and PTR records can be generated

License
-------

MIT Licensed
