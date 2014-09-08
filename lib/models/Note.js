module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("Note", {
    id: Sequelize.UUID,
    userid: Sequelize.TEXT,
    posted: Sequelize.DATE,
    modified: Sequelize.DATE,
    note: Sequelize.TEXT
  });
};
