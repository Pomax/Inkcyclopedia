var inks = require('../lib/inks');
var vendors = require('../lib/vendors');
var submit = require('../lib/submit');
var edit = require('../lib/edit');

module.exports = {
  setup: function(app) {
    app.get('/', inks.load, vendors.load, this.main);
    app.get('/unverified', function(req, res, next) {
      res.locals.showUnverified = true;
      next();
    }, inks.load, vendors.load, this.main);

    app.get('/submit', inks.load, this.submit);
    app.post('/submit', submit.process, this.postSubmission);

    app.get('/edit', this.edit);
    app.post('/edit', edit.process, this.postEdit);

    app.param("inkid", function(req, res, next, inkid) {
      req.params.inkid = inkid;
      next();
    });

    app.use(function(err, req, res, next){
      res.status(err.status).json(err);
    });
  },

  main: function(req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    if (!res.locals.showUnverified) {
      res.locals.showUnverified = false;
    }
    res.render('main.html');
  },

  submit: function(req, res) {
    res.render('submit.html', res.locals);
  },

  postSubmission: function(req, res) {
    res.render('posted.html');
  },

  edit: function(req, res) {
    res.render('edit.html', res.locals);
  },

  postEdit: function(req, res) {
    res.render('posted.html');
  }

}
