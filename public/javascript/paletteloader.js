var header = document.querySelector("header");
var palette = document.querySelector("header div.palette");

function buildPaletteSwatch(li, color) {
  var div = document.createElement("div");
  div.classList.add("palette-swatch");
  div.style.background = color;
  div.onclick = function(e) {
    palette.removeChild(div);
    if(palette.children.length === 1) {
      header.classList.remove("palette");
    }
  };
  return div;
}

function addToPalette(li) {
  header.classList.add("palette");
  var color = li.getAttribute("data-color");
  palette.appendChild(buildPaletteSwatch(li, color));
}
