/**
 * ...
 */
function setupPersona(email) {
  var html    = document.querySelector("html");
  var persona = document.querySelector(".persona");

  var login   = persona.querySelector(".login-button");
  var logout  = persona.querySelector(".logout-button");
  var hidden  = persona.querySelector(".persona-email");
  var account = persona.querySelector(".account");

  var loggedin = function(evt) {
    var data = evt.detail;
    html.classList.add("logged-in");
    hidden.setAttribute("value", data.email);
    account.querySelector("button").onclick = function() {
      var ul = account.querySelector("ul");
      if(ul.classList.contains("hidden")) {
        ul.classList.remove("hidden");
      } else { ul.classList.add("hidden"); }
    };
    persona.querySelector("a.explanation").classList.add("hidden");
  };

  if(email) { loggedin({ detail: { email: email }}); }

  var loggedout = function(evt) {
    html.classList.remove("logged-in");
    hidden.removeAttribute("value");
    account.querySelector("button").onclick = function(){};
    account.querySelector("ul").classList.add("hidden");
    persona.querySelector("a.explanation").classList.remove("hidden");
  };

  login.addEventListener("click", function() { navigator.id.request(); });
  logout.addEventListener("click", function() { navigator.id.logout(); });

  navigator.id.watch({
    onlogin: function(assertion) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/persona/verify", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("loadend", function(e) {
        var data = JSON.parse(this.responseText);
        if (data && data.status === "okay") {
          document.dispatchEvent(new CustomEvent("persona-user-login", { detail: data }));
        }
      });
      xhr.send(JSON.stringify({ assertion: assertion }));
    },
    onlogout: function() {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/persona/logout", true);
      xhr.addEventListener("loadend", function(e) {
        document.dispatchEvent(new CustomEvent("persona-user-logout"));
      });
      xhr.send();
    }
  });

  document.addEventListener("persona-user-login", loggedin);
  document.addEventListener("persona-user-logout", loggedout);
}
