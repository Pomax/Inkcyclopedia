module.exports = function checkAuthentication(req, res, next) {
  if(!req.session.email) {
    next({
      status: 403,
      error: "Authenticated operation requested without being logged in."
    });
  } else { next(); }
};
