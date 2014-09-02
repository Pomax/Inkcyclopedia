var Sequelize = require("sequelize");

module.exports = function(next) {
  console.log("Connecting to the database...");
  var username = process.env.DB_USERNAME || "username";
  var password = process.env.DB_PASSWORD || "password";
  var sequelize = new Sequelize("inkcyclopedia", username, password, {
        logging: false,
        dialect: "sqlite",
        storage: "inkcyclopedia.sqlite"
      });
  require("./models")(sequelize, Sequelize, next);
};
