function setStyle(e, s) {
  Object.keys(s).forEach(function(t) {
    e.style[t] = s[t];
  });
}

function loadImage(url, rgb) {
  var underlay = document.createElement("div");
  setStyle(underlay, {
    background: "rgba(0,0,0,0.4)", //rgb.replace('rgb','rgba').replace(')',',0.2)'),
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    textAlign: "center",
    lineHeight: window.innerHeight + "px"
  });
	var img = new Image();
  img.onload = function() {
    setStyle(img, {
      border: "10px solid " + rgb,
      maxWidth: "calc(100% - 20px)"
    });
    underlay.appendChild(img);
    document.body.appendChild(underlay);      
  };
  img.src = url;
  underlay.onclick = function() {
    underlay.parentNode.removeChild(underlay);
  }
}
