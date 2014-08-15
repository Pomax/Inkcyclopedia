var fs = require("fs");
var rgbanalyse = require("rgbanalyse");
var crypto = require('crypto');

module.exports = {
  process: function(req, res, next) {
  	var imguri   = req.body.image;
  	var company  = req.body.company.trim();
    var inkname  = req.body.inkname.trim();
    var dominant = req.body.dominant.trim().split(',');
    dominant = { r: parseInt(dominant[0]), g: parseInt(dominant[1]), b: parseInt(dominant[2]) };

  	// turn image into a file
  	var bpos = imguri.indexOf(";base64,");
  	var filedata = imguri.substring(bpos + 8);
  	filedata = new Buffer(filedata, "base64");
  	var type = imguri.substring(5, bpos);
  	bpos = type.indexOf("/")+1;
  	type = type.substring(bpos);
  	
  	// we don't need crypto, we just need hashing, don't bitch about md5 being insecure
    var md5sum = crypto.createHash('md5');
    md5sum.update(imguri);
    var name = md5sum.digest('hex');
    var filename = "temp/" + name  + "." + type;
    fs.writeFile(filename, filedata, function(err) {

  	  	rgbanalyse.analyse(filename, function(err, data) {
  	  		fs.unlinkSync(filename);
  	  		var dataObject = {
  	  			imageData: imguri,
            company: company,
            inkname: inkname,
            dominant: dominant,
  	  			analysis: data.analysis
  	  		};
  	  		var datafile = "data/" + name + ".json";
  	  		fs.writeFile(datafile, JSON.stringify(dataObject, false, 2), function() {
            // done
  	  		});
  	  	});

    });
  	next();
  }
};
