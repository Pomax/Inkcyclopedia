module.exports = {

  // Bind properties in such a way that modifying
  // them marks the object as dirty.
  propdef: function(obj, properties) {
    if(typeof properties === "string") {
      properties = [properties];
    }
    properties.forEach(function(prop) {
      var v;
      obj.defineprop(prop, {
        get: function() { return v; },
        set: function(nv) { v = nv; obj.dirty = true; }
      });
    });
  },

  // Rebinds the save function so that saves
  // only occur if the object was dirty.
  protodef: function(proto) {
    var fn = proto.save;
    proto.save = function() {
      if(this.dirty) {
        fn.apply(this, arguments);
        this.dirty = false;
      }
    }
  }

};
