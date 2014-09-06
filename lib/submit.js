module.exports = function(inks, models) {
  var fs = require("fs-extra");
  var verify = require("./verifier");
  var converter = require("./converter");

  /**
   * ...
   */
  function writeImageTo(imageData, path) {
    var bpos = imageData.indexOf(";base64,");
    var filedata = imageData.substring(bpos + 8);
    filedata = new Buffer(filedata, "base64");
    fs.ensureFile(path, function() {
      fs.writeFile(path, filedata, function(err,result) {
        if(err) console.error(err);
      });
    });
  }

  /**
   * ...
   */
  function processSample(email, sample) {

    var rgb = sample.dominant.split(',').map(function(v) { return parseInt(v); }),
        r = rgb[0],
        g = rgb[1],
        b = rgb[2],
        hsl = converter.rgbToHSL(r, g, b),
        yuv = converter.rgbToYUV(r, g, b);
        unverified = true;

    var ink = models.Ink.build({
      id      : models.uuid.v4(),
      company : sample.company,
      inkline : sample.inkline,
      inkname : sample.inkname
    });

    var colorprofile = models.ColorProfile.build({
      id : models.uuid.v4()
      , r: r
      , g: g
      , b: b
      , H: hsl.h
      , S: hsl.s
      , L: hsl.l
      , Y: yuv.y
      , U: yuv.u
      , V: yuv.v
    });

    var profile = models.Profile.build({
      id             : models.uuid.v4(),
      inkid          : ink.id,
      colorprofileid : colorprofile.id,
      year           : sample.year        || 2014 ,
      pigmented      : sample.pigmented   || false,
      fluorescent    : sample.fluorescent || false,
      blacklight     : sample.blacklight  || false,
      temperature    : sample.temperature || false,
      scented        : sample.scented     || false
    });


    var image = models.Image.build({
      id        : models.uuid.v4(),
      profileid : profile.id,
      penid     : '',
      userid    : email,
      type      : "sample"
    });

    profile.images = [image.id];
    ink.profiles = [profile.id];

    // We're not doing pen definitions yet. Too much work atm.

    writeImageTo(sample.datauri,  "public/inks/images/" + image.id + "/sample.png");
    writeImageTo(sample.thumburi, "public/inks/images/" + image.id + "/thumb.png");
    writeImageTo(sample.cropuri,  "public/inks/images/" + image.id + "/crop.png");

    image.save();
    colorprofile.save();
    profile.save();
    ink.save();

    // update the ink data pool
    inks.update();
  }

  /**
   * ...
   */
  return {
    process: function(req, res, next) {

      if(!req.body.sample) {
        return next({ status: 409, error: "No sample was submitted" });
      }

      var sample = req.body.sample;

      if(!verify(sample)) {
        return next({ status: 409, error: "sample did not pass verification" });
      }

      models.Ink.find({ where: {
        company: sample.company,
        inkline: sample.inkline,
        inkname: sample.inkname
      }}).success(function(data) {
        if (data) {
          return next({
            status: 409,
            error: sample.company + (sample.inkline ? " " + sample.inkline : '') + "'s "+sample.inkname+" already has a sample."
          });
        }
        else {
          next();
          processSample(req.session.email, sample);
        }
      });

    }
  };
};
