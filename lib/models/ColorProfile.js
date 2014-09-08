module.exports = function(sequelize,Sequelize,utils) {
  return sequelize.define("ColorProfile", {
    id: Sequelize.UUID
    // RGB information
    , r: Sequelize.FLOAT
    , g: Sequelize.FLOAT
    , b: Sequelize.FLOAT
    // HSL information
    , H: Sequelize.FLOAT
    , S: Sequelize.FLOAT
    , L: Sequelize.FLOAT
    // YUV information
    , Y: Sequelize.FLOAT
    , U: Sequelize.FLOAT
    , V: Sequelize.FLOAT
  });
};
