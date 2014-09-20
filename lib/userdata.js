module.exports = function(models) {
  return function(req, res, next) {
    res.locals.ownpage = false;
    if(req.session.email) {
      models.User.find({ where: { email: req.session.email }}).success(function(user) {
        res.locals.user = user;
        if (req.params.userid === user.id || req.params.userid === user.alias) {
          res.locals.ownpage = true;
        }
        next();
      });
    } else { next(); }
  }
};
