// see https://github.com/Pomax/Inkcyclopedia/issues/14
module.exports = function defineModels(sequelize, Sequelize, next) {

  var getArray = function(name) {
    return function() {
      return this.getDataValue(name).split(",");
    };
  };

  var setArray = function(name) {
    return function(v) {
      return this.setDataValue(name, v.join(","));
    };
  };

  var getset = function(name) {
    return {
      type: Sequelize.TEXT,
      get: getArray(name),
      set: setArray(name)
    };
  };

  var models = {

    Ink: sequelize.define("Ink", {
      id: Sequelize.UUID,
      company: Sequelize.TEXT,
      inkline: { type: Sequelize.TEXT, defaultValue: "" },
      inkname: Sequelize.TEXT,
      profiles: getset("profiles"),
      notes: getset("notes")
    }),

    Profile: sequelize.define("Profile", {
      id: Sequelize.UUID,
      inkid: Sequelize.UUID,
      colorprofileid: Sequelize.UUID,
      year: Sequelize.INTEGER(4),
      pigmented: Sequelize.BOOLEAN,
      fluorescent: Sequelize.BOOLEAN,
      blacklight: Sequelize.BOOLEAN,
      temperature: Sequelize.BOOLEAN,
      scented: Sequelize.BOOLEAN,
      images: getset("images"),
      notes: getset("notes"),
      verified: { type:Sequelize.BOOLEAN, defaultValue: false }
    }),

    ColorProfile: sequelize.define("ColorProfile", {
      id: Sequelize.UUID
      // RGB information
      , r: Sequelize.FLOAT
      , g: Sequelize.FLOAT
      , b: Sequelize.FLOAT
      // HSL information
      , H: Sequelize.FLOAT
      , S: Sequelize.FLOAT
      , L: Sequelize.FLOAT
      // YUV information
      , Y: Sequelize.FLOAT
      , U: Sequelize.FLOAT
      , V: Sequelize.FLOAT
    }),

    Image: sequelize.define("Image", {
      id: Sequelize.UUID,
      profileid: Sequelize.UUID,
      userid: Sequelize.TEXT,
      type: Sequelize.TEXT, // "sample", "writing", "ink blot", etc.
      penid:  Sequelize.UUID,
      notes: getset("notes")
    }),

    Pen: sequelize.define("Pen", {
      id: Sequelize.UUID,
      company: Sequelize.TEXT,
      model: Sequelize.TEXT,
      year: Sequelize.INTEGER(4),
      nibid: Sequelize.UUID,
      notes: getset("notes")
    }),

    Nib: sequelize.define("Nib", {
      id: Sequelize.UUID,
      company: Sequelize.TEXT,
      model: Sequelize.TEXT,
      year: Sequelize.INTEGER(4),
      type: Sequelize.TEXT, // "regular", "italic", "flex", etc.
      size: Sequelize.TEXT,
      notes: getset("notes")
    }),

    Note: sequelize.define("Note", {
      id: Sequelize.UUID,
      userid: Sequelize.TEXT,
      posted: Sequelize.DATE,
      modified: Sequelize.DATE,
      note: Sequelize.TEXT
    }),

    User: sequelize.define("User", {
      id: Sequelize.TEXT,
      alias: { type: Sequelize.TEXT, defaultValue: "" },
      verified: { type: Sequelize.BOOLEAN, defaultValue: false }
    }),

    sequelize: sequelize,
    Sequelize: Sequelize,
    uuid: require("uuid")

  };

  sequelize
    .sync()
    .error(function(err) { next(err); })
    .success(function() { next(false, models) });
};
