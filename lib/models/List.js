module.exports = function(sequelize,Sequelize,utils) {
  // wishlist, ownership lists, selections, etc.
  return sequelize.define("List", {
    id: Sequelize.TEXT,
    userid: Sequelize.TEXT,
    type: Sequelize.TEXT, // "wishlist", "owned", "selection"
    inks: utils.getset("inks"),
    notes: utils.getset("notes")
  });
};
