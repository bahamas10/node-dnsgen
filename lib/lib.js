var util = require('util');

/**
 * return a serial string
 */
module.exports.serial = function(d) {
  var currentTime = d || new Date(),
      month = currentTime.getMonth() + 1,
      day = currentTime.getDate(),
      year = currentTime.getFullYear(),
      date_fmt = util.format('%s%s%s01',
          (year >= 10)  ? year  : '0' + year,
          (month >= 10) ? month : '0' + month,
          (day >= 10)   ? day   : '0' + day
      );
  return date_fmt;
};
