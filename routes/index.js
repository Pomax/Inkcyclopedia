var inks = require('../lib/inks');
var submit = require('../lib/submit');

module.exports = {
  setup: function(app) {
    app.get('/', inks.load, this.main);
    app.get('/submit', this.submit);
    app.post('/submit', submit.process, this.postSubmission);
  },

  main: function(req, res) {
    res.render('main.html');
  },

  submit: function(req, res) {
    res.render('submit.html', res.locals);
  },

  postSubmission: function(req, res) {
    res.render('posted.html');
  }
}
