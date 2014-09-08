module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("User", {
    id: Sequelize.TEXT, // persona email
    alias: { type: Sequelize.TEXT, defaultValue: "" },
    verified: { type: Sequelize.BOOLEAN, defaultValue: false }
  });
};
