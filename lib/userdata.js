module.exports = function(models) {
  return function(req, res, next) {
    if(req.session.email) {
      models.User.find({ where: { email: req.session.email }}).success(function(user) {
        res.locals.user = user;
        next();
      });
    } else { next(); }
  }
}