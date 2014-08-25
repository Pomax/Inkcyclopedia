var header = document.querySelector("header");
var palette = document.querySelector("header div.palette");

function setStyle(e, s) {
  Object.keys(s).forEach(function(t) {
    e.style[t] = s[t];
  });
}

function showAllSamples() {
  var srcs = Array.prototype.map.call(palette.querySelectorAll("img"), function(i) {
    var img = new Image();
    img.src = i.src.replace("crop", "sample");
    img.classList.add("preview-all");
    return img;
  });
  var underlay = document.createElement("div");
  underlay.classList.add("underlay");
  underlay.classList.add("palette");
  setStyle(underlay, {
    height: "100%"
  });
  document.body.appendChild(underlay);
  srcs.forEach(function(img) {
    underlay.appendChild(img);
  });
  underlay.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    underlay.parentNode.removeChild(underlay);
    document.querySelector("main div.swatch.pane").classList.remove("noscroll");
    return false;
  };
}

function removePaletteSwatch(li) {
  var div = li.swatch;
  return function(e) {
    palette.removeChild(div);
    li.classList.remove("palette-swatch")
    if(palette.children.length === 1) {
      header.classList.remove("palette");
    }
  };
}

function buildPaletteSwatch(li, color) {
  var div = document.createElement("div");
  div.classList.add("palette-swatch");
  div.style.background = color;

  var img = new Image();
  img.src = li.querySelector(".crop img").src;
  img.title = "Compare all samples";
  div.appendChild(img);

  img.onmouseover = function(e) {
    Array.prototype.forEach.call(palette.querySelectorAll("img"), function(i) {
      i.classList.add("highlight");
    });
  }
  img.onmouseout = function(e) {
    Array.prototype.forEach.call(palette.querySelectorAll("img"), function(i) {
      i.classList.remove("highlight");
    });
  }
  img.onclick = function(e) {
    e.stopPropagation();
    e.preventDefault();
    showAllSamples();
    return false;
  }

  li.classList.add("palette-swatch")
  li.swatch = div;

  div.onclick = removePaletteSwatch(li);

  return div;
}

function addToPalette(li) {
  header.classList.add("palette");
  var color = li.getAttribute("data-color");
  if(li.classList.contains("palette-swatch")) {
    return removePaletteSwatch(li)();
  }
  palette.appendChild(buildPaletteSwatch(li, color));
}
