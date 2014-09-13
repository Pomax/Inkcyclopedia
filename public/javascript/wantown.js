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

}
