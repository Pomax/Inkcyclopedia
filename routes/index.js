
/**
 *
 */
function setup(app, _models) {
  models = _models;
  var inks = require('../lib/inks')(models);
  var vendors = require('../lib/vendors');
  var submit = require('../lib/submit')(models);

  // main page
  app.get('/', inks.load, vendors.load, this.main);

  // submission page + POST handler
  app.get('/submit', inks.load, this.submit);
  app.post('/submit', submit.process, this.postSubmission);

  // unverified submissions page
  app.get('/unverified', function(req, res, next) {
    res.locals.showUnverified = true;
    next();
  }, inks.load, vendors.load, this.main);


//  app.get('/edit', this.edit);
//  app.post('/edit', edit.process, this.postEdit);

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

  app.use(function(err, req, res, next){
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

};
