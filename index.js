var bind = require('./lib/bind'),
    tinydns = require('./lib/tinydns');

module.exports.bindReverse = function(j) {
  return bind(j, true);
};
module.exports.bind = function(j) {
  return bind(j, false);
};

module.exports.tinydns = tinydns;
