module.exports = function(sequelize,Sequelize,utils) {
  // wishlist, ownership lists, selections, etc.
  return sequelize.define("List", {
    id: Sequelize.UUID,
    userid: Sequelize.TEXT,
    type: Sequelize.TEXT, // "wishlist", "owned", "selection"
    inks: utils.getset("inks"),
    name: Sequelize.TEXT,
    notes: utils.getset("notes")
  });
};
