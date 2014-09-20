(function() {
  var buttons = find("section.selections button.delete");
  buttons.forEach(function(b) {
    b.listen("click", function(evt) {
      post("/delete/list", { id: b.get("data-id") }, function(xhr) {
        b.parent().remove();
      });
    });
  });
}());
