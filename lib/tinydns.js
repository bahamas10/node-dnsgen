var util = require('util'),
    Stream = require('stream').Stream,
    lib = require('./lib'),
    defaults = require('./defaults');

// Create the stream for the DNS file to be created
module.exports = function(j) {
  var emitter = new Stream();
  process.nextTick(function() {
    gen_header(j, emitter);
    gen_records(j, emitter);
    emitter.emit('end');
  });
  return emitter;
}

// Generate the header line
function gen_header(j, emitter) {
  var s = util.format([
    '# tinydns file for %s (%s)',
    'Z%s:%s:%s:%s:%s:%s:%s',
    ''
    ].join('\n'),
      j.domain,
      j.netmask,
      j.domain,
      j.ns[0],
      j.admin,
      lib.serial(),
      j.time.refresh || defaults.time.refresh,
      j.time.retry || defaults.time.retry,
      j.time.expire || defaults.time.expire
  );
  emitter.emit('data', s);
  // Loop the ns servers
  j.ns.forEach(function(ns) {
    s = util.format('&%s::%s:%s\n', j.domain, ns, j.time.ttl);
    emitter.emit('data', s);
  });
  return emitter;
}

function gen_records(j, emitter) {
  // Create PTR and A records
  Object.keys(j.hosts).forEach(function(ip) {
    var host = j.hosts[ip],
        name = (typeof host === 'string') ? host : host.name,
        comment = (host.comment) ? util.format('\t# %s', host.comment) : '';
    s = util.format('=%s:%s%s\n', name, ip, comment);
    emitter.emit('data', s);
  });
  return emitter;
}
