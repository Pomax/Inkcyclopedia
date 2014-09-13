module.exports = function(models) {
  return function(req, res, next) {
    var user = res.locals.user;
    var alias = req.body.alias;

    models
    .User
    .find({ where: "lower(alias) = lower('"+alias+"')" })
    .success(function(result) {
      if(!result) {
        user.alias = req.body.alias;
        user.save().success(function() {
          next();
        });
      } else {
        next({status: 409, error: "Someone else has already claimed this alias."});
      }
    });

  };
};
