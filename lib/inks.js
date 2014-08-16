var fs = require("fs");
var path = require("path");
var rgbanalyse = require("rgbanalyse");
var tau = Math.PI*2;
var shift = 0.7;

var inks = [];
var inkmap = {};

var inksloader = {
  /**
   * Generally only called on startup, and when submissions take place
   */
  update: function() {
    inks = [];
    inksmap = {};
    fs.readdir("data", function(err, dir) {

      dir.forEach(function(f) {
        if(f.indexOf(".json") !== -1) {
          var data = (function() {
            var fsdata = fs.readFileSync(path.join(__dirname, '..', 'data', f));
            return JSON.parse(fsdata);
          }());
          data.dominant.hsl = (function() {
            var rgb = data.dominant;
            var m = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
            var r = rgb.r / m;
            var g = rgb.g / m;
            var b = rgb.b / m;
            var hsl = rgbanalyse.computeHSL(r,g,b);
            return hsl;
          }());
          data.id = f.replace(".json",'');
          inks.push(data);
          inkmap[data.id] = data;
        }
      });

      inks.sort(function(a,b) {
        a = (a.dominant.hsl.H + shift) % tau;
        b = (b.dominant.hsl.H + shift) % tau;
        return b - a;
      });

    });
  },
  /**
   * Alias the ink information into res.locals
   */
  load: function(req, res, next) {
    res.locals.inks = inks;
    res.locals.inkmap = inkmap;
    next();
  }
};

inksloader.update();

module.exports = inksloader;
