function setStyle(e, s) {
  Object.keys(s).forEach(function(t) {
    e.style[t] = s[t];
  });
}

var ul = document.querySelector("main ul");
var previews = document.querySelector("li.previews");
var previewing = 0;
var loaded = {};

function addImage(url) {
  if(!previewing) {
    previews.classList.remove("hidden");
    ul.querySelector(".nextcolumn").classList.remove("hidden");
    ul.classList.remove("cc1");
    ul.classList.add("cc2");
  }

  loaded[url] = new Image();
  loaded[url].onclick = function() { removeImage(url); };
  loaded[url].src = url;
  previews.appendChild(loaded[url]);
  previewing++;
}

function removeImage(url) {
  previews.removeChild(loaded[url]);
  loaded[url] = false;
  previewing--;

  if(previewing === 0) {
    ul.classList.remove("cc2");
    ul.classList.add("cc1");
    ul.querySelector(".nextcolumn").classList.add("hidden");
    previews.classList.add("hidden");
  }
}

function loadImage(inkid, rgb) {
  /*
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
  */

  var url = "images/" + inkid;
  if(!loaded[url]) { addImage(url); } else { removeImage(url); }
}
