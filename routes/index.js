function setUnverified(req, res, next) {
  if (!res.locals.showUnverified) {
    res.locals.showUnverified = false;
  }
  next();
}

function setup(app, _models) {
  (function bindParameters() {
    app.param("inkid", function(req, res, next, inkid) {
      req.params.inkid = inkid;
      next();
    });

    app.param("userid", function(req, res, next, email) {
      req.params.email = email;
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


  models = _models;
  var inks = require('../lib/inks')(models);
  var vendors = require('../lib/vendors');
  var submit = require('../lib/submit')(inks, models);
  var auth = require('../lib/auth');
  var session = require('../lib/session')(models);
  var lists = require('../lib/lists')(models);
  var userdata = require('../lib/userdata')(models);
  var setalias = require('../lib/setalias')(models);

  (function bindRoutes() {
    app.get('/', inks.load, vendors.load, setUnverified, session, userdata, lists.loadlists, this.main);
    app.get('/about', inks.load, this.about);
    app.get('/blog', inks.load, this.blog);

    app.get('/submit', inks.load, this.submit);
    app.post('/submit', auth, submit.process, this.postSubmission);

    app.get('/unverified', function(req, res, next) {
      res.locals.showUnverified = true;
      next();
    }, inks.load, vendors.load, this.main);

    app.get('/owned/:userid', inks.load, vendors.load, setUnverified, session, userdata, lists.loadlists, lists.own, this.main);
    app.get('/wishlist/:userid', inks.load, vendors.load, setUnverified, session, userdata, lists.loadlists, lists.want, this.main);

    app.post('/own/:inkid', auth, lists.markOwned, this.ownink);
    app.post('/want/:inkid', auth, lists.markWanted, this.wantink);

    app.get('/myaccount', auth, session, userdata, inks.load, this.account);
    app.post('/myaccount/setalias', auth, session, userdata, setalias, this.postSubmission);

  }.bind(this)());

  app.use(function errorHandler(err, req, res, next){
    console.log(err.status);
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
    res.render('inklist/main.html', res.locals);
  },

  about: function(req, res) {
    res.render('site/about.html');
  },

  blog: function(req, res) {
    res.render('site/blog.html');
  },

  submit: function(req, res) {
    res.render('submit/submit.html', res.locals);

  },

  postSubmission: function(req, res) {
    res.render('submit/posted.html');
  },

  account: function(req, res) {
    res.render('user/account.html');
  },

  ownink: function(req, res) {
    res.render('submit/posted.html');
  },

  wantink: function(req, res) {
    res.render('submit/posted.html');
  }
};
