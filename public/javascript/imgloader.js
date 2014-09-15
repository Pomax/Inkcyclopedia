function loadImage(e, id, rgb) {
  var e = e || window.event;
  e.stopPropagation();
  e.preventDefault();

  var underlay = document.createElement("div");
  underlay.classes().add("underlay").css({ lineHeight: window.innerHeight + "px" });
  body.add(underlay);

  var img = new Image();
  img.classes().add("loading").src = "images/ajax-loader.gif";
  underlay.add(img);

  var sample = new Image();
  sample.onload = function() {
    underlay.replace(img, sample.css({ borderColor: rgb }));
    find("main div.swatch.pane").classes().add("noscroll");
  };
  sample.src ="/inks/images/"+id+"/sample.png";

  underlay.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    underlay.remove();
    find("main div.swatch.pane").classes().remove("noscroll");
    return false;
  };

  return false;
}