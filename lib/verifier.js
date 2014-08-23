/**
 * verification object for submitted ink data
 */

var verifier = {
  datauri:  function(v) { return v.indexOf("data:image/png;base64,") === 0; },
  thumburi: function(v) { return v.indexOf("data:image/png;base64,") === 0; },
  cropuri:  function(v) { return v.indexOf("data:image/png;base64,") === 0; },
  company:  function(v) { return v.trim() !== ""; },
  inkname:  function(v) { return v.trim() !== ""; },
  dominant: function(v) { return v.split(',').length === 3; },
};

var vkeys = Object.keys(verifier);

module.exports = function verify(obj) {
  var okeys = Object.keys(obj);
  if(okeys.length !== vkeys.length) { return false; }
  for(var key, i=vkeys.length-1; i>=0; i--) {
    key = vkeys[i];
    if(!obj[key]) {
      console.log("missing key "+key);
      return false;
    }
    if(!verifier[key](obj[key])) {
      console.log("key "+key+" failed verifcation: " + obj[key]);
      return false;
    }
  }
  return true;
};
