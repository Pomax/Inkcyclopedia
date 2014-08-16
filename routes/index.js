var inks = require('../lib/inks');
var submit = require('../lib/submit');

module.exports = {
  setup: function(app) {
    app.get('/', inks.load, this.main);
    app.get('/submit', this.submit);
    app.post('/submit', submit.process, this.postSubmission);
    app.param("inkid", function(req, res, next, inkid) {
      req.params.inkid = inkid;
      next();
    });
    app.get("/images/:inkid", inks.load, this.image);
  },

  main: function(req, res) {
    res.render('main.html');
  },

  submit: function(req, res) {
    res.render('submit.html', res.locals);
  },

  postSubmission: function(req, res) {
    res.render('posted.html');
  },

  /**
   * Generate an image for an inkid. Because images are not files on disk, but datauris in a .json object
   */
  image: function(req, res) {
    res.set('Content-Type', 'image/png');
    var inkdata = res.locals.inkmap[req.params.inkid];
    var imguri = inkdata.imageData;
    // turn image into a file
    var bpos = imguri.indexOf(";base64,");
    var filedata = imguri.substring(bpos + 8);
    filedata = new Buffer(filedata, "base64");
    var type = imguri.substring(5, bpos);
    bpos = type.indexOf("/")+1;
    type = type.substring(bpos);
    // set the response information
    res.type = type;
    res.send(new Buffer( filedata ));
  }
}
