var fs = require("fs");
var rgbanalyse = require("rgbanalyse");
var crypto = require("crypto");
var inks = require("./inks");

var verifier = {
  datauri: function(v) { return v.indexOf("data:image/png;base64,")===0; },
  thumburi: function(v) { return v.indexOf("data:image/png;base64,")===0; },
  company: function(v) { return v.trim() !== ""; },
  inkname: function(v) { return v.trim() !== ""; },
  dominant: function(v) { return v.split(',').length === 3; },
};

var vkeys = Object.keys(verifier);

function verify(obj) {
  var okeys = Object.keys(obj);
  if(okeys.length !== vkeys.length) { return false; }
  for(var key, i=vkeys.length-1; i>=0; i--) {
    key = vkeys[i];
    if(!obj[key]) {
      console.log("missing key "+key);
      return false;
    }
    if(!verifier[key](obj[key])) {
      console.log("key "+key+" failed verifcation: " + obj[key]);
      return false;
    }
  }
  return true;
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
      sample.dominant = sample.dominant.split(',').map(function(v) { return parseInt(v); });
      sample.dominant = {
        r: sample.dominant[0],
        g: sample.dominant[1],
        b: sample.dominant[2]
      };

    	// turn image into a file
      var imageData = sample.datauri;
    	var bpos = imageData.indexOf(";base64,");
    	var filedata = imageData.substring(bpos + 8);
    	filedata = new Buffer(filedata, "base64");
    	var type = imageData.substring(5, bpos);
    	bpos = type.indexOf("/")+1;
    	type = type.substring(bpos);
    	
    	// we don't need crypto, we just need hashing, don't bitch about md5 being insecure
      var md5sum = crypto.createHash('md5');
      md5sum.update(imageData);
      var name = md5sum.digest('hex');
      var filename = "temp/" + name  + "." + type;
      fs.writeFile(filename, filedata, function(err) {

    	  	rgbanalyse.analyse(filename, function(err, data) {
            sample.analysis = data.analysis;
    	  		var datafile = "data/" + name + ".json";
    	  		fs.writeFile(datafile, JSON.stringify(sample, false, 2), function() {
              // done
              fs.unlinkSync(filename);
              inks.update();
    	  		});

    	  	});

      });
    });

  }
};
