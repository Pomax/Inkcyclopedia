var crypto = require("crypto");

module.exports = {
  hash: function() {
    return Array.prototype.slice.call(arguments).map(function(v) {
      var md5sum = crypto.createHash('md5');
      md5sum.update(v);
      return md5sum.digest('hex');
    });
  }
};
