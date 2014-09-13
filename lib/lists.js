module.exports = function(models) {

  function runListOperation(inkid, userid, listtype) {
    models.List
      .find({where: { userid: userid, type: listtype }})
      .success(function(result) {
        if(result) {
          var inks = result.inks;
          var pos = inks.indexOf(inkid);
          if(pos > -1) { inks.splice(pos,1); }
          else { inks.push(inkid); }
          result.inks = inks;
          result.save();
        }
        else {
          var list = models.List.build({
            id: models.uuid.v4(),
            userid: userid,
            type: listtype,
            inks: [inkid]
          });
          list.save();
        }
      });
  };

  function findList(userid, listtype, res, next) {
    var S = models.Sequelize;
    models.User.find({ where:
      S.or( {id: userid} , "lower(alias)=lower('"+userid+"')" )
    }).success(function(user) {
      if (user) {
        models.List
          .find({where: { userid: user.id, type: listtype }})
          .success(function(result) {
            res.locals.list = result ? result.inks : [];
            next();
          });
      } else { next(); }
    });
  }

  return {
    loadlists: function(req, res, next) {
      res.locals.owned = [];
      res.locals.wishlist = [];
      if(res.locals.userid) {
        models
        .List
        .findAll({where: { userid: res.locals.userid }})
        .success(function(results) {
          results = results || [];
          results.forEach(function(r) {
            if (r.type === "owned") { res.locals.owned = r.inks; }
            if (r.type === "wishlist") { res.locals.wishlist = r.inks; }
          });
          next();
        });
      } else { next(); }
    },
    markOwned: function(req, res, next) {
      var inkid = req.params.inkid;
      var email = req.session.email;
      models.User.find({where: { email: email}}).success(function(user) {
        runListOperation(inkid, user.id, "owned");
      });
      next();
    },
    markWanted: function(req, res, next) {
      var inkid = req.params.inkid;
      var email = req.session.email;
      models.User.find({where: { email: email}}).success(function(user) {
        runListOperation(inkid, user.id, "wishlist");
      });
      next();
    },
    own: function(req, res, next) {
      findList(req.params.userid, "owned", res, next);
    },
    want: function(req, res, next) {
      findList(req.params.userid, "wishlist", res, next);
    }
  };

};
