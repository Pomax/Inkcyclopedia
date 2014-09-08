module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("Nib", {
    id: Sequelize.UUID,
    company: Sequelize.TEXT,
    model: Sequelize.TEXT,
    year: Sequelize.INTEGER(4),
    type: Sequelize.TEXT, // "regular", "italic", "flex", etc.
    size: Sequelize.TEXT,
    notes: utils.getset("notes")
  });
};
