module.exports = function(models) {

  function toggleInk(inkid, userid, listtype) {
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
            name: listtype,
            inks: [inkid]
          });
          list.save();
        }
      });
  }

  function storeInkSelection(name, inks, email, userid, next) {
    models.List.find({where: {
      name: name,
      userid: userid
    }}).success(function(list) {
      if(!list) {
        var list = models.List.build({
          id: models.uuid.v4(),
          name: name,
          userid: userid,
          type: "selection",
          inks: inks
        });
        list.save();
        next();
      } else {
        next({status: 409, error: "There is already a list by this name for this user."});
      }
    });
  }

  function findLists(userid, res, next) {
    res.locals.lists = {}
    var S = models.Sequelize;
    models.User.find({ where:
      S.or( {id: userid} , "lower(alias)=lower('"+userid+"')" )
    }).success(function(user) {
      if (user) {
        models.List
          .findAll({where: { userid: user.id }})
          .success(function(results) {
            results.forEach(function(result) {
              res.locals.lists[result.name] = result.inks;
            });
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
        toggleInk(inkid, user.id, "owned");
      });
      next();
    },
    markWanted: function(req, res, next) {
      var inkid = req.params.inkid;
      var email = req.session.email;
      models.User.find({where: { email: email}}).success(function(user) {
        toggleInk(inkid, user.id, "wishlist");
      });
      next();
    },
    saveSelection: function(req, res, next) {
      var name = req.body.name;
      var inks = req.body.inks;
      var email = req.session.email;
      var userid = res.locals.userid;
      storeInkSelection(name, inks, email, userid, next);
    },
    getLists: function(req, res, next) {
      findLists(req.params.userid, res, next);
    },
    own: function(req, res, next) {
      res.locals.list = res.locals.lists["owned"];
      delete res.locals.lists;
      next();
    },
    want: function(req, res, next) {
      res.locals.list = res.locals.lists["wishlist"];
      delete res.locals.lists;
      next();
    },
    selection: function(req, res, next) {
      delete res.locals.lists["owned"];
      delete res.locals.lists["wishlist"];
      next();
    },
  };
};
