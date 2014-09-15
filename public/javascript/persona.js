/**
 * ...
 */
window.PersonaHelper = {
  setupPersona: function(email) {
    var html    = find("html");
    var persona = find(".persona");

    var login   = persona.find(".login-button");
    var logout  = persona.find(".logout-button");
    var hidden  = persona.find(".persona-email");
    var account = persona.find(".account");

    var loggedin = function(evt) {
      var data = evt.detail;
      html.classes().add("logged-in");
      hidden.value = data.email;
      account.find("button").onclick = function() {
        var ul = account.find("ul");
        if(ul.classes().contains("hidden")) {
          ul.classes().remove("hidden");
        } else { ul.classes().add("hidden"); }
      };
      persona.find("a.explanation").classes().add("hidden");
    };

    if(email) { loggedin({ detail: { email: email }}); }

    var loggedout = function(evt) {
      html.classes().remove("logged-in");
      hidden.removeAttribute("value");
      account.find("button").onclick = function(){};
      account.find("ul").classes().add("hidden");
      persona.find("a.explanation").classes().remove("hidden");
    };

    login.listen("click", function() { navigator.id.request(); });
    logout.listen("click", function() { navigator.id.logout(); });

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

    document.listen("persona-user-login", loggedin);
    document.listen("persona-user-logout", loggedout);
  }
};
