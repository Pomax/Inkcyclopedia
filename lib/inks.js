var fs = require("fs");
var rgbanalyse = require("rgbanalyse");
var tau = Math.PI*2;
var shift = 0.7;

module.exports = {
  load: function(req, res, next) {
    res.locals.inks = [];
    fs.readdir("data", function(err, dir) {

      dir.forEach(function(f) {
        if(f.indexOf(".json") !== -1) {
          var data = require('../data/' + f);
          data.dominant.hsl = (function() {
            var rgb = data.dominant;
            var m = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
            var r = rgb.r / m;
            var g = rgb.g / m;
            var b = rgb.b / m;
            var hsl = rgbanalyse.computeHSL(r,g,b);
            return hsl;
          }());
          res.locals.inks.push(data);
        }
      });

      res.locals.inks.sort(function(a,b) {
        a = (a.dominant.hsl.H + shift) % tau;
        b = (b.dominant.hsl.H + shift) % tau;
        return b - a;
      });

      next();
    });
  }
};
