// see https://github.com/Pomax/Inkcyclopedia/issues/14
module.exports = function defineModels(sequelize, Sequelize, next) {

  var utils = {
    getArray: function(name) {
      return function() {
        return this.getDataValue(name).split(",");
      };
    },
    setArray: function(name) {
      return function(v) {
        return this.setDataValue(name, v.join(","));
      };
    },
    getset: function(name) {
      return {
        type: Sequelize.TEXT,
        get: this.getArray(name),
        set: this.setArray(name)
      };
    }
  };

  var models = {
    Ink: require("./Ink")(sequelize, Sequelize, utils),
    Profile: require("./Profile")(sequelize, Sequelize, utils),
    ColorProfile: require("./ColorProfile")(sequelize, Sequelize, utils),
    Image: require("./Image")(sequelize, Sequelize, utils),
    Pen: require("./Pen")(sequelize, Sequelize, utils),
    Nib: require("./Nib")(sequelize, Sequelize, utils),
    Note: require("./Note")(sequelize, Sequelize, utils),
    User: require("./User")(sequelize, Sequelize, utils),
    List: require("./List")(sequelize, Sequelize, utils),

    sequelize: sequelize,
    Sequelize: Sequelize,
    uuid: require("uuid")
  };

  sequelize
    .sync()
    .error(function(err) { next(err); })
    .success(function() { next(false, models) });
};
