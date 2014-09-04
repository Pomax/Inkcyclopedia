var uuid = require("uuid");
var fs = require("fs-extra");
var path = require("path");

console.log("unlinking database.");
var res = fs.unlinkSync("inkcyclopedia.sqlite");

require("./lib/dbase")(function(err, models) {

  var inks = (function setupInkLoader() {
    var inks = [];
    var inkmap = {};
    var inkdata = {
      /**
       * Generally only called on startup, and when submissions take place
       */
      update: function(callback) {

        // reload from data directory
        fs.ensureDirSync("public/legacy/metadata");
        fs.readdir("public/legacy/metadata", function(err, dir) {
          var _inks = [];
          var _inkmap = {};

          dir.forEach(function(f) {
            if(f.indexOf(".json") !== -1) {
              var data = (function() {
                var file = path.join(__dirname, 'public/legacy/metadata', f);
                var fsdata = fs.readFileSync(file);
                try {
                  return JSON.parse(fsdata);
                } catch (e) {
                  console.error("error parsing "+file);
                  return false;
                }
              }());

              _inks.push(data);
              _inkmap[data.id] = data;
            }
          });

          inks = _inks;
          inkmap = _inkmap;

          if(callback) { callback(this); }
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

    return inkdata;
  }());

  /**
   * move images from their old location to the new location on disk
   */
  var moveImages = function(ink, image) {
    var loc = "public/legacy/images/"+ink.id;
    var newloc = "public/inks/images/"+image.id;
    fs.copySync(loc, newloc);
  };

  /**
   * save and crosslink
   */
  var save = function(ink, image, colorprofile, profile, newink) {
    image.save().success(function() {
      console.log("saved image ", image.id);
      moveImages(ink, image);
      colorprofile.save().success(function() {
        profile.colorprofileid = colorprofile.id;
        profile.images = [image.id];
        profile.save().success(function() {
          console.log("saved profile ", profile.id);
          newink.profiles = [profile.id];
          newink.save().success(function() {
            console.log("saved", newink.company, "/", newink.inkname,"base data");
          });
        });
      });
    });
  };

  /**
   * convert all the old inks to the new format
   */
  var convertInks = function(pen) {
    var req = {};
    var res = { locals: {} };

    console.log("Preparing to convert...");
    inks.update(function() {
      console.log("Loading old ink data...");

      inks.load(req, res, function() {
        console.log("Loaded old ink data...");

        var inks = res.locals.inks;
        var inkmap = res.locals.inkmap;

        console.log("Iterating over old inks.");
        inks.forEach(function(ink) {

          var newink = models.Ink.build({
            id: uuid.v4(),
            company: ink.company,
            inkname: ink.inkname,
          });

          var profile = models.Profile.build({
            id: uuid.v4(),
            inkid: newink.id,
            year: 2014,
            pigmented: false,
            fluorescent: false,
            blacklight: false,
            temperature: false,
            scented: false
          });

          var colorprofile = models.ColorProfile.build({
            id: uuid.v4(),
            r: ink.dominant.rgb.r,
            g: ink.dominant.rgb.g,
            b: ink.dominant.rgb.b,
            α: ink.dominant.hsl.α,
            β: ink.dominant.hsl.β,
            H: ink.dominant.hsl.H,
            S: ink.dominant.hsl.S,
            L: ink.dominant.hsl.L,
            C: ink.dominant.hsl.C
          });

          var image = models.Image.build({
            id: uuid.v4(),
            profileid: profile.id,
            penid:  pen.id,
            userid: "pomax@nihongoresources.com",
            type: "sample"
          });

          save(ink, image, colorprofile, profile, newink);

        });

      });
    });
  };

  var user = models.User.build({
    id: "pomax@nihongoresources.com",
    alias: "Pomax",
    verified: true
  });

  user.save().success(function() {
    console.log("Saved master user account");
    var nib = models.Nib.build({
          id: uuid.v4(),
          company: "Platinum",
          model: "Preppy",
          year: 2014,
          type: "regular",
          size: "03"
        });
    nib.save().success(function() {
      console.log("Saved Platinum Preppy 03 nib");
      var pen = models.Pen.build({
            id: uuid.v4(),
            company: "Platinum",
            model: "Preppy",
            year: 2014,
            nibid: nib.id
          });
      pen.save().success(function() {
        console.log("Saved Platinum Preppy pen");
        convertInks(pen);
      });
    });
  });

});
