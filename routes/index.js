// These are all the content serving/accepting endpoints.
var routes = {
  main: function(req, res) {
    res.render('main/main.html', res.locals);
  },

  listdata: function(req, res) {
    res.json({ list: res.locals.list });
  },

  about: function(req, res) {
    res.render('site/about.html');
  },

  blog: function(req, res) {
    res.render('site/blog.html');
  },

  whatyouget: function(req, res) {
    res.render('site/whatyouget.html');
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


// Parameter binding
function bindParameters(app) {
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
}

/**
 * ...
 */
module.exports = function(models) {

  var inks = require('../lib/inks')(models);
  var vendors = require('../lib/vendors');
  var submit = require('../lib/submit')(inks, models);
  var auth = require('../lib/auth');
  var session = require('../lib/session')(models);
  var lists = require('../lib/lists')(models);
  var userdata = require('../lib/userdata')(models);
  var setalias = require('../lib/setalias')(models);

  function setUnverified(req, res, next) {
    if (!res.locals.showUnverified) {
      res.locals.showUnverified = false;
    }
    next();
  }

  function showUnverified(req, res, next) {
    res.locals.showUnverified = true;
    next();
  }

  function nofilter(req, res, next) {
    res.locals.nofilter = true;
    next();
  }

  function track(req, res, next) {
    console.log("track");
    next();
  }

  function noCache(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    next();
  }

  function bindRoutes(app) {
    app.get('/',           noCache, inks.load, vendors.load, setUnverified, session, userdata, lists.loadlists, routes.main);
    app.get('/about',      inks.load, routes.about);
    app.get('/blog',       inks.load, routes.blog);
    app.get('/whatyouget', inks.load, routes.whatyouget);
    app.get('/unverified', showUnverified, inks.load, vendors.load, routes.main);

    // sample submission
    app.get('/submit',     inks.load, routes.submit);
    app.post('/submit',    auth, submit.process, routes.postSubmission);

    // list fetching
    app.get('/owned',       auth, session, userdata, lists.loadlists, lists.own,  routes.listdata);
    app.get('/wishlist',    auth, session, userdata, lists.loadlists, lists.want, routes.listdata);

    app.get('/owned/:userid',       inks.load, vendors.load, session, userdata, lists.loadlists, lists.getLists, lists.own,       routes.main);
    app.get('/wishlist/:userid',    inks.load, vendors.load, session, userdata, lists.loadlists, lists.getLists, lists.want,      routes.main);
    app.get('/selections/:userid',  inks.load, vendors.load, session, userdata, lists.loadlists, lists.getLists, lists.selection, nofilter, routes.main);

    // list posting
    app.post('/own/:inkid',         auth, lists.markOwned, routes.ownink);
    app.post('/want/:inkid',        auth, lists.markWanted, routes.wantink);
    app.post('/selections',         auth, session, userdata, lists.saveSelection, routes.postSubmission);

    // user account things
    app. get('/myaccount',          auth, session, userdata, inks.load, routes.account);
    app.post('/myaccount/setalias', auth, session, userdata, setalias,  routes.postSubmission);

  }

  function setup(app) {
    bindParameters(app);
    bindRoutes(app);
    app.use(function errorHandler(err, req, res, next){
      console.error(err);
      res.status(err.status).json(err);
    });
  }

  return { setup: setup };
};
