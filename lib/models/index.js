// see https://github.com/Pomax/Inkcyclopedia/issues/14

module.exports = function defineModels(sequelize, Sequelize) {
  var models = {

    Ink: sequelize.define("Ink", {
      id: Sequelize.UUIDV4,
      company: Sequelize.TEXT,
      inkname: Sequelize.TEXT,
      profiles: Sequelize.ARRAY(Sequelize.UUIDV4),
      notes: Sequelize.ARRAY(Sequelize.UUIDV4)
    }),

    Profile: sequelize.define("Profile", {
      id: Sequelize.UUIDV4,
      inkid: Sequelize.UUIDV4,
      year: Sequelize.INTEGER(4),
      pigmented: Sequelize.BOOLEAN,
      fluorescent: Sequelize.BOOLEAN,
      blacklight: Sequelize.BOOLEAN,
      temperature: Sequelize.BOOLEAN,
      scented: Sequelize.BOOLEAN,
      profiles: Sequelize.ARRAY(Sequelize.UUIDV4),
      notes: Sequelize.ARRAY(Sequelize.UUIDV4)
    }),

    Image: sequelize.define("Image", {
      id: Sequelize.UUIDV4,
      profileid: Sequelize.UUIDV4,
      userid: Sequelize.TEXT,
      type: Sequelize.ENUM("sample", "writing", "ink blot"),
      penid:  Sequelize.UUIDV4,
      notes: Sequelize.ARRAY(Sequelize.UUIDV4)
    }),

    Pen: sequelize.define("Pen", {
      id: Sequelize.UUIDV4,
      company: Sequelize.TEXT,
      model: Sequelize.TEXT,
      year: Sequelize.INTEGER(4),
      nibid: Sequelize.UUIDV4,
      notes: Sequelize.ARRAY(Sequelize.UUIDV4)
    }),

    Nib: sequelize.define("Nib", {
      id: Sequelize.UUIDV4,
      company: Sequelize.TEXT,
      model: Sequelize.TEXT,
      year: Sequelize.INTEGER(4),
      type: Sequelize.ENUM("regular", "italic", "flex"),
      size: Sequelize.TEXT,
      notes: Sequelize.ARRAY(Sequelize.UUIDV4)
    }),

    Note: sequelize.define("Note", {
      id: Sequelize.UUIDV4,
      userid: Sequelize.TEXT,
      posted: Sequelize.DATE,
      modified: Sequelize.DATE,
      note: Sequelize.TEXT
    }),

    User: sequelize.define("User", {
      id: Sequelize.TEXT,
      verified: Sequelize.BOOLEAN
    }),

    sequelize: sequelize,
    Sequelize: Sequelize

  };

  sequelize.sync();

  return models;
};
