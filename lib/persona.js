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
    audience: process.argv.indexOf("--local") > -1 ? "http://localhost:1234" : "http://inkcyclopedia.org",
    verifyResponse: function (error, req, res, email) {
      // ensure this user exists
      models.User.find({
        where: { email: email }
      }).success(function(user) {
        if(!user) {
          models.User.build({
            id: models.uuid.v4(),
            email: email
          }).save().success(function() {
            res.json({ "status": "okay", "email": email });
          });
        } else {
          res.json({ "status": "okay", "email": email });
        }
      });
    }
  });

};
