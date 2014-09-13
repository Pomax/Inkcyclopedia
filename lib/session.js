module.exports = function(models) {
  return function(req, res, next) {
    var email = req.session.email;
    if(email) {
      res.locals.email = email;
      models.User.find({ where: { email: email }}).success(function(user) {
        res.locals.userid = user.id;
        next();
      });
    } else { next(); }
  };
};
