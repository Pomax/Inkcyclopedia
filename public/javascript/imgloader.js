function setStyle(e, s) {
  Object.keys(s).forEach(function(t) {
    e.style[t] = s[t];
  });
}

function loadImage(e, id, rgb) {
  var e = e || window.event;
  e.stopPropagation();
  e.preventDefault();

  var underlay = document.createElement("div");
  underlay.classList.add("underlay");
  setStyle(underlay, {
    lineHeight: window.innerHeight + "px"
  });
  document.body.appendChild(underlay);

  var img = new Image();
  img.classList.add("loading");
  img.src="images/ajax-loader.gif";
  underlay.appendChild(img);

  var sample = new Image();
  sample.onload = function() {
    setStyle(sample, {
      borderColor: rgb
    });
    img.parentNode.replaceChild(sample,img);
    document.querySelector("main div.swatch.pane").classList.add("noscroll");
  };
  sample.src = "/inks/images/"+id+"/sample.png";

  underlay.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    underlay.parentNode.removeChild(underlay);
    document.querySelector("main div.swatch.pane").classList.remove("noscroll");
    return false;
  };

  return false;
}