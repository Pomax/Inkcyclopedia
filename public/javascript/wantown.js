/**
 * enable the wishlist/ownlist functionality
 */
var email = document.querySelector(".persona .persona-email").value;

if(!!email) {
  function toggleOwnWant(id, qs)  {
    var e = document.getElementById(id).querySelector(qs);
    if(e.classList.contains("I")) {
      e.classList.remove("I");
    } else {
      e.classList.add("I");
    }
  }

  function activateWantOwn(id) {
    var element = document.getElementById(id);
    var own = element.querySelector(".own");
    var want = element.querySelector(".want");
    own.addEventListener("click", function() { toggleOwnWant(id, ".own"); });
    want.addEventListener("click", function() { toggleOwnWant(id, ".want"); });
  }

  function sendUpdate(inkid, route) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/" + route + "/" + inkid, true);
    xhr.onreadystatechange = function(evt) {
      // we actually don't really care what happens here...
    };
    var data = JSON.stringify({ inkid: inkid});
    xhr.send(data);
  }

  function ownInk(inkid) { sendUpdate(inkid, "own"); }
  function wantInk(inkid) { sendUpdate(inkid, "want"); }


  function loggedin() {
    if(window.preloadedWOLists) return;
    get("/owned", function(data) {
      var obj = JSON.parse(data.responseText);
      obj.list.forEach(function(inkid) {
        toggleOwnWant("swatch-"+inkid, ".own.icon");
      });
    });
    get("/wishlist", function(data) {
      var obj = JSON.parse(data.responseText);
      obj.list.forEach(function(inkid) {
        toggleOwnWant("swatch-"+inkid, ".want.icon");
      });
    });
  }

  function loggedout() {
    window.preloadedWOLists = false;
    find(".own.icon").classes().remove("I");
    find(".want.icon").classes().remove("I");
  }

  document.listen("persona-user-login", loggedin);
  document.listen("persona-user-logout", loggedout);
}
