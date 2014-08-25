var fs = require("fs-extra");
var inks = require("./inks");

module.exports = {
  process: function(req, res, next) {
    next();
  }
};
