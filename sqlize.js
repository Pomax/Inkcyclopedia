var uuid = require("uuid");
require("./lib/dbase")(function(err, models) {

  /**
   * move images from their old location to the new location on disk
   */
  var moveImages = function(ink, image) {
    // move to public/ink/images/imageid/[standard, ...]

    // ...

    // then unlink original

    // ...
  };

  /**
   * save and crosslink
   */
  var save = function(image, profile, newink) {
    image.save().success(function() {
      console.log("saved image ", image.id);
      moveImages(newink, image);
      profile.images = [image.id];
      profile.save().success(function() {
        console.log("saved profile ", profile.id);
        newink.profiles = [profile.id];
        newink.save().success(function() {
          console.log("saved", newink.company, "/", newink.inkname,"base data");
        });
      });
    });
  };

  /**
   * convert all the old inks to the new format
   */
  var convertInks = function(pen) {
    var inks = require("./lib/inks");
    var req = {};
    var res = { locals: {} };

    console.log("Preparing to convert...");
    inks.update(function() {
      console.log("Loading old ink data...");

      inks.load(req, res, function() {
        console.log("Loaded old ink data...");

        var inks = res.locals.inks;
        var inkmap = res.locals.inkmap;

        console.log("Iterating over old inks.");
        inks.forEach(function(ink) {

          var newink = models.Ink.build({
            id: uuid.v4(),
            company: ink.company,
            inkname: ink.inkname,
          });

          var profile = models.Profile.build({
            id: uuid.v4(),
            inkid: ink.id,
            year: 2014,
            pigmented: false,
            fluorescent: false,
            blacklight: false,
            temperature: false,
            scented: false
          });

          // plain image
          var image = models.Image.build({
            id: uuid.v4(),
            profileid: profile.id,
            penid:  pen.id,
            userid: "pomax@nihongoresources.com",
            type: "sample"
          });

          save(image, profile, newink);

        });

      });
    });
  };

  var user = models.User.build({
    id: "pomax@nihongoresources.com",
    alias: "Pomax",
    verified: true
  });

  user.save().success(function() {
    console.log("Saved master user account");
    var nib = models.Nib.build({
          id: uuid.v4(),
          company: "Platinum",
          model: "Preppy",
          year: 2014,
          type: "regular",
          size: "03"
        });
    nib.save().success(function() {
      console.log("Saved Platinum Preppy 03 nib");
      var pen = models.Pen.build({
            id: uuid.v4(),
            company: "Platinum",
            model: "Preppy",
            year: 2014,
            nibid: nib.id
          });
      pen.save().success(function() {
        console.log("Saved Platinum Preppy pen");
        convertInks(pen);
      });
    });
  });

});
