module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("Pen", {
    id: Sequelize.UUID,
    company: Sequelize.TEXT,
    model: Sequelize.TEXT,
    year: Sequelize.INTEGER(4),
    nibid: Sequelize.UUID,
    notes: utils.getset("notes")
  });
};
