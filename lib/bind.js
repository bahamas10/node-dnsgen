var util = require('util'),
    Netmask = require('netmask').Netmask,
    Stream = require('stream').Stream,
    lib = require('./lib'),
    defaults = require('./defaults');

// Create the stream for the DNS file to be created
module.exports = function(j, reverse) {
  var emitter = new Stream();
  process.nextTick(function() {
    gen_bind_header(j, emitter);
    gen_bind_lines(j, reverse, emitter);
    emitter.emit('end');
  });
  return emitter;
}

// Generate the lines for the bind file
function gen_bind_lines(j, reverse, emitter) {
  var d = (reverse) ? '' : j.domain + '.';

  // Load the name server lines first
  j.ns.forEach(function(ns) {
    var s = util.format('%s\tIN\tNS\t%s.\n', d, ns);
    emitter.emit('data', s);
  });

  // Make the ptrs or A records
  Object.keys(j.hosts).forEach(function(ip) {
    var host = j.hosts[ip],
        name = (typeof host === 'string') ? host : host.name,
        comment = (host.comment) ? util.format('\t; %s', host.comment) : '',
        s;
    if (reverse) {
      // PTR records
      var mask = new Netmask(j.netmask),
          s_ip = mask.base.split('.'),
          num = Math.floor(mask.bitmask / 8),
          sl_ip = ip.split('.').slice(num).join('.');
      s = util.format('%s\tIN\tPTR\t%s.%s.%s\n', sl_ip, name, j.domain, comment);
      emitter.emit('data', s);
    } else {
      // A Records
      s = util.format('%s\tIN\tA\t%s%s\n', name, ip, comment);
      emitter.emit('data', s);
    }
  });
  return emitter;
};

// Generate the header line
function gen_bind_header(j, emitter) {
  var date_fmt = lib.serial(),
      s = util.format([
    '; Bind file for %s (%s)',
    '@\tIN\tSOA\t%s.\t%s. (',
    '\t%s\t; serial',
    '\t%s\t; refresh',
    '\t%s\t; retry',
    '\t%s\t; expire',
    '\t%s\t; ttl',
    ')',
    ''
    ].join('\n'),
      j.domain,
      j.netmask,
      j.ns[0],
      j.admin,
      date_fmt,
      j.time.refresh || defaults.time.refresh,
      j.time.retry || defaults.time.retry,
      j.time.expire || defaults.time.expire,
      j.time.ttl || defaults.time.ttl
  );
  emitter.emit('data', s);
  return emitter;
}
