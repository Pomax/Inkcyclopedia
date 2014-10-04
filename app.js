// Don't bother running if we don't have a database to work with.
require("./lib/dbase")(function(err, models) {

  var fs = require("fs"),
      express = require("express"),
      app = express(),
      routes = require("./routes"),
      bodyParser = require("body-parser");

  app.disable('x-powered-by');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);

  app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
  app.use(bodyParser.json({ limit: "100mb" }));

  app.use(express.static(__dirname + '/public'));

  require("./lib/persona")(express, app, models);

  routes(models).setup(app);

  var server = app.listen(1234, function() {
    console.log('Listening on port %d', server.address().port);
  });

});
