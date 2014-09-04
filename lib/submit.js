module.exports = function(models) {
  var fs = require("fs-extra");
  var rgbanalyse = require("rgbanalyse");
  var verify = require("./verifier");
  var uuid = require("uuid");

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
  function processSample(sample) {

    var rgb = sample.dominant.split(',').wwmap(function(v) { return parseInt(v); }),
        r = rgb[0],
        g = rgb[1],
        b = rgb[2],
        t = r+g+b,
        R = r/t,
        G = g/t,
        B = b/t,
        hsl = rgbanalyse.computeHSL(R,G,B),
        unverified = true;

    var ink = models.Ink.build({
      id      : uuid.v4(),
      company : ink.company,
      inkline : ink.inkline,
      inkname : ink.inkname
    });

    var colorprofile = models.ColorProfile.build({
      id : uuid.v4(),
      r  : r,
      g  : g,
      b  : b,
      α  : hsl.α,
      β  : hsl.β,
      H  : hsl.H,
      S  : hsl.S,
      L  : hsl.L,
      C  : hsl.C
    });

    var image = models.Image.build({
      id        : uuid.v4(),
      profileid : profile.id,
      penid     : '',
      userid    : '',
      type      : "sample"
    });

    var profile = models.Profile.build({
      id             : uuid.v4(),
      inkid          : ink.id,
      colorprofileid : colorprofile.id,
      images         : [image.id],
      year           : sample.year        || 2014 ,
      pigmented      : sample.pigmented   || false,
      fluorescent    : sample.fluorescent || false,
      blacklight     : sample.blacklight  || false,
      temperature    : sample.temperature || false,
      scented        : sample.scented     || false
    });


    // We're not doing pen definitions yet. Too much work atm.

    writeImageTo(sample.datauri,  "public/inks/images/" + image.id + "/sample.png");
    writeImageTo(sample.thumburi, "public/inks/images/" + image.id + "/thumb.png");
    writeImageTo(sample.cropuri,  "public/inks/images/" + image.id + "/crop.png");

    image.save();
    colorprofile.save();
    profile.save();

    ink.profiles = [profile.id];
    ink.save();
  }

  /**
   * ...
   */
  return {
    process: function(req, res, next) {
      var samples = req.body.samples;

      // verify there are samples
      if(!samples || samples.length===0) {
        return next({ status: 409, error: "No samples were sent" });
      }

      // quick verification of sample data
      for(var sample, i=samples.length-1; i>=0; i--) {
        sample = samples[i];
        if(!verify(sample)) {
          return next({ status: 409, error: "sample "+i+" did not pass verification" });
        }
        var id = inkhash.hash(sample.company, sample.inkname);
        if(fs.existsSync("public/inks/images/"+id)) {
          return next({ status: 409, error: sample.company + "'s "+sample.inkname+" already has a sample." });
        }
      }

      // as a POST operation, it doesn't matter that we call next()
      // before everything's processed: all we need to do is error if
      // the input is illegal.
      next();

      // lastly, also properly process the samples, of course
      samples.forEach(processSample);

    }
  };
};
