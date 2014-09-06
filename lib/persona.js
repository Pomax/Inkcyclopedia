module.exports = function(express, app, models) {
  var persona = require("express-persona"),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      secret = process.env.INKCYCLOPEDIA_PERSONA_SECRET || "dummy value";

  app.use(bodyParser.json())
     .use(bodyParser.urlencoded( { extended: true } ))
     .use(cookieParser())
     .use(session({ secret: secret, resave: true, saveUninitialized: true }));

  persona(app, {
    audience: "http://localhost:1234",
    middleware: function(req,res,next) {
      // Ensure the user exists
      if(req.session.email) {
        // ensure this user exists
        models.User.findOrCreate({
          id: req.session.email
        }).success(function(user) {
          next();
        })
      } else { next(); }
    }
  });

};
