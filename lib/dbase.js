var Sequelize = require("sequelize");

module.exports = function(next) {
  var username = process.env.DB_USERNAME || "username";
  var password = process.env.DB_PASSWORD || "password";
  var sequelize = new Sequelize("inkcyclopedia", username, password, {
        dialect: "sqlite",
        storage: "inkcyclopedia.sqlite",
        logging: false
      });
  next(false, require("./models")(sequelize,Sequelize));
};
