function setupAccountButtons(uid, original) {
  var button = find("button.alias");
  var input = find("input.alias");
  var result = find("div.result");

  button.listen("click", function() {
    result.classList.add("hidden");

    var value = input.value;
    if (value == original) return;
    if (!value.trim()) return;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/myaccount/setalias", true);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onreadystatechange = function() {
      if(xhr.status === 200) {
        if (xhr.readyState === 4) {
          // success
          result.textContent = "Settings saved.";
          result.classList.remove("hidden");
          uid = value;
          original = value;
        }
      }
      else if(parseInt(xhr.status,10) >= 400) {
        result.textContent = "Settings could not be saved.";
        result.classList.remove("hidden");
      }
    }
    var data = JSON.stringify({ alias: value });
    xhr.send(data);
  });
}
