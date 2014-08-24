var fs = require("fs-extra");
var rgbanalyse = require("rgbanalyse");
var crypto = require("crypto");
var inks = require("./inks");
var verify = require("./verifier");


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


module.exports = {
  process: function(req, res, next) {
    var samples = req.body.samples;

    // verify there are samples
    if(!samples || samples.length===0) {
      return next(new Error("No samples were sent"));
    }

    // quick verification of sample data
    for(var sample, i=samples.length-1; i>=0; i--) {
      sample = samples[i];
      if(!verify(sample)) {
        return next(new Error("sample "+i+" did not pass verification"));
      }
    }

    // as a POST operation, it doesn't matter that we call next()
    // before everything's processed: all we need to do is error if
    // the input is illegal.
    next();

    // lastly, also properly process the samples, of course
    samples.forEach(function(sample) {

      // we don't need crypto, we just need hashing
      var md5sum = crypto.createHash('md5');
      md5sum.update(sample.company);
      md5sum.update(sample.inkname);
      var id = md5sum.digest('hex');
      sample.id = id;

      var rgb = sample.dominant.split(',').map(function(v) { return parseInt(v); }),
          r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          t = r+g+b,
          R = r/t,
          G = g/t,
          B = b/t;

      sample.dominant = {
        rgb: { r : r, g : g, b : b },
        hsl: rgbanalyse.computeHSL(R,G,B)
      };

      // write our images to disk
      (function(sample) {
        writeImageTo(sample.datauri, "public/inks/images/" + id + "/sample.png");
        delete sample.datauri;
        writeImageTo(sample.thumburi, "public/inks/images/" + id + "/thumb.png");
        delete sample.thumburi;
        writeImageTo(sample.cropuri, "public/inks/images/" + id + "/crop.png");
        delete sample.cropuri;
      }(sample));

      var datafile = "public/inks/metadata/" + id + ".json";
      fs.writeFile(datafile, JSON.stringify(sample, false, 2), function() {
        inks.update();
      });

    });

  }
};
