module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("Image", {
    id: Sequelize.UUID,
    profileid: Sequelize.UUID,
    userid: Sequelize.TEXT,
    type: Sequelize.TEXT, // "sample", "writing", "ink blot", etc.
    penid:  Sequelize.UUID,
    notes: utils.getset("notes")
  });
};
