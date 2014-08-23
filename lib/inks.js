var fs = require("fs");
var path = require("path");
var rgbanalyse = require("rgbanalyse");
var tau = Math.PI*2;
var shift = 0;

var inks = [];
var inkmap = {};

// company listing is super useful
var companies = false;
function getCompanies() {
  if(!companies) {
    companies = {};
    inks.forEach(function(ink) {
      if(!companies[ink.company]) {
        companies[ink.company] = 0;
      }
      companies[ink.company]++;
    });
  }
  return companies;
}

// lock variables
var reloading = false;
var schedule = false;

var inkdata = {

  /**
   * Generally only called on startup, and when submissions take place
   */
  update: function(callback) {
    // lock to prevent concurrent updates
    if(reloading) { schedule = true; return; }
    reloading = true;
    companies = false;

    // reload from data directory
    fs.readdir("public/inks/metadata", function(err, dir) {
      var _inks = [];
      var _inkmap = {};

      dir.forEach(function(f) {
        if(f.indexOf(".json") !== -1) {
          var data = (function() {
            var file = path.join(__dirname, '..', 'public/inks/metadata', f);
            var fsdata = fs.readFileSync(file);
            try {
              return JSON.parse(fsdata);
            } catch (e) {
              console.error("error parsing "+file);
              return false;
            }
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

          _inks.push(data);
          _inkmap[data.id] = data;
        }
      });

      _inks.sort(function(a,b) {
        a = (a.dominant.hsl.H + shift) % tau;
        b = (b.dominant.hsl.H + shift) % tau;
        return a - b;
      });

      inks = _inks;
      inkmap = _inkmap;
      inkmap.getCompanies = getCompanies;
      if(callback) { callback(this); }
    });

    // unlock, and check if we need to run because one or more
    // other update request was made while we were updating.
    reloading = false;
    if (schedule) {
      schedule = false;
      this.update();
    }
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

inkdata.update();

module.exports = inkdata;
