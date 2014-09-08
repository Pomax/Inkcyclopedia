module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("Ink", {
    id: Sequelize.UUID,
    company: Sequelize.TEXT,
    inkline: { type: Sequelize.TEXT, defaultValue: "" },
    inkname: Sequelize.TEXT,
    profiles: utils.getset("profiles"),
    notes: utils.getset("notes")
  });
};
