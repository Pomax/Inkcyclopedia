module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("Profile", {
    id: Sequelize.UUID,
    inkid: Sequelize.UUID,
    colorprofileid: Sequelize.UUID,
    year: Sequelize.INTEGER(4),
    pigmented: Sequelize.BOOLEAN,
    fluorescent: Sequelize.BOOLEAN,
    blacklight: Sequelize.BOOLEAN,
    temperature: Sequelize.BOOLEAN,
    scented: Sequelize.BOOLEAN,
    images: utils.getset("images"),
    notes: utils.getset("notes"),
    verified: { type:Sequelize.BOOLEAN, defaultValue: false }
  });
};
