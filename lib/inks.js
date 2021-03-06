module.exports = function(models) {
  var vendors = require("./vendors");
  var tau = Math.PI*2;
  var shift = 0;
  var models;

  var reloading = false, schedule = false;

  var inkdata = {
    inks: [],
    inkmap: {},

    inkCount: 0,
    companies: [],
    swatches: [],

    getInkCount: function() {
      return this.inkCount;
    },

    getCompanies: function() {
      return this.companies;
    },

    update: function(callback) {
      // lock to prevent concurrent updates
      if(reloading) { schedule = true; return; }
      reloading = true;

      // get list of companies/inklines/ink count

// This query will not be useful until we can do filtering on company + inkline
//      var query = [
//        "SELECT DISTINCT(company), inkline, COUNT(company) AS count",
//        "FROM Inks",
//        "GROUP BY company, inkline",
//        "ORDER BY company"
//      ].join(" ");

      var query = [
        "SELECT DISTINCT(company), COUNT(company) AS count",
        "FROM Inks",
        "GROUP BY company",
        "ORDER BY company"
      ].join(" ");

      models.sequelize.query(query, null, {raw: true}).success(function(data) {
        inkdata.companies = data;

        models.Ink.findAndCountAll().success(function(result) {
          inkdata.inkCount = result.count;

          query = [
            "SELECT Inks.id as id, company, inkline, inkname, r, g, b, H, S, L, Y, U, V, images, verified",
            "FROM Inks, Profiles, ColorProfiles",
            "WHERE Inks.id = Profiles.inkid AND Profiles.colorprofileid = ColorProfiles.id"
          ].join(" ");

          models.sequelize.query(query, null, {raw: true}).success(function(data) {
            inkdata.swatches = data;

            inkdata.inkmap = {};
            data.forEach(function(e) { inkdata.inkmap[e.id] = e; });

            inkdata.swatches.sort(function(_a,_b) {
              var a = (_a.H + shift) % tau;
              var b = (_b.H + shift) % tau;
              var c = a-b;
              if (c===0) {
                a = _a.company + " " + _a.inkname;
                b = _b.company + " " + _b.inkname;
                return a<b ? -1 : 1;
              }
              return c;
            });

            if(callback) { callback(this); }

            // unlock, and check if we need to run because one or more
            // other update request was made while we were updating.
            reloading = false;
            if (schedule) {
              schedule = false;
              inkdata.update();
            }
          });
        });
      });
    },

    /**
     * Alias the ink information into res.locals
     */
    load: function(req, res, next) {
      res.locals.inkdata = inkdata;
      vendors.load(req, res, function() {
        next();
      });
    }
  };

  inkdata.update();

  return inkdata;
};
