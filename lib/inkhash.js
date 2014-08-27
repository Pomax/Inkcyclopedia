var crypto = require("crypto");

module.exports = {
  hash: function(sample) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(sample.company);
    md5sum.update(sample.inkname);
    return md5sum.digest('hex');
  }
}