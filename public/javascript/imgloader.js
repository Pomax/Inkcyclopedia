function setStyle(e, s) {
  Object.keys(s).forEach(function(t) {
    e.style[t] = s[t];
  });
}

function loadImage(url, rgb) {
  var underlay = document.createElement("div");
  setStyle(underlay, {
    background: "rgba(0,0,0,0.4)",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    textAlign: "center",
    lineHeight: window.innerHeight + "px"
  });
  document.body.appendChild(underlay);      
	var img = new Image();
  img.src="ajax-loader.gif";
  underlay.appendChild(img);

  var sample = new Image();
  sample.onload = function() {
    setStyle(sample, {
      border: "10px solid " + rgb,
      maxWidth: "calc(100% - 20px)"
    });
    img.parentNode.replaceChild(sample,img);
  };
  sample.src = url;
  underlay.onclick = function() {
    underlay.parentNode.removeChild(underlay);
  }
}
