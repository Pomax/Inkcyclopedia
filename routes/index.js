function setUnverified(req, res, next) {
  if (!res.locals.showUnverified) {
    res.locals.showUnverified = false;
  }
  next();
}

function setup(app, _models) {
  models = _models;
  var inks = require('../lib/inks')(models);
  var vendors = require('../lib/vendors');
  var submit = require('../lib/submit')(inks, models);


  (function bindParameters() {
    app.param("inkid", function(req, res, next, inkid) {
      req.params.inkid = inkid;
      next();
    });

    app.param("company", function(req, res, next, company) {
      req.params.company = company.toLowerCase();
      next();
    });

    app.param("inkname", function(req, res, next, inkname) {
      req.params.inkname = company.toLowerCase();
      next();
    });
  }.bind(this)());


  (function bindRoutes() {
    app.get('/', inks.load, vendors.load, setUnverified, this.main);

    app.get('/submit', inks.load, this.submit);
    app.post('/submit', submit.process, this.postSubmission);

    app.get('/unverified', function(req, res, next) {
      res.locals.showUnverified = true;
      next();
    }, inks.load, vendors.load, this.main);

    // app.get('/edit', this.edit);
    // app.post('/edit', edit.process, this.postEdit);

    // app.get('/:company', inks.load, setUnverified, this.company);
    // app.get('/:company/:inkname', inks.load, setUnverified, this.ink);
  }.bind(this)());


  app.use(function errorHandler(err, req, res, next){
    console.log(err);
    res.status(err.status).json(err);
  });
}

/**
 *
 */
module.exports = {
  setup: setup,

  main: function(req, res) {
    res.setHeader('Cache-Control', 'no-cache');
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
  },

  company: function(req, res) {
    res.render('main.html');
  },

  ink: function(req, res) {
    res.render('main.html');
  }

};
