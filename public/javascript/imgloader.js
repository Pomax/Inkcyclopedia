var main = document.querySelector("main");
var swatches = document.querySelector(".swatch.pane");
var previews = document.querySelector(".preview.pane");

function switchPanes(e) {
  var switchpanes;
  if(typeof e !== "boolean") {
    e.preventDefault();
    e.stopPropagation();
    switchpanes = main.classList.contains("switched");
  } else {
    switchpanes = e;
  }

  if(switchpanes) {
    main.classList.remove("switched");
  } else {
    main.classList.add("switched");
  }

  return false;
};

swatches.addEventListener("click", switchPanes);
previews.addEventListener("click", switchPanes);

function setStyle(e, s) {
  Object.keys(s).forEach(function(t) {
    e.style[t] = s[t];
  });
}

var loaded = {};

function loadImage(li, url, rgb) {

  if(!loaded[url]) {

    li.classList.add("previewing");
    setStyle(li, {
      borderColor: rgb,
      background: rgb
    });

    var sample = new Image();
    sample.setAttribute("title", "click to remove");
    sample.src = url;
    setStyle(sample, {
      boxSizing: "border-box",
      border: "2px solid " + rgb
    });

    if(previews.children.length === 1) {
      previews.querySelector("h1").classList.add("hidden");
    }

    sample.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      li.classList.remove("previewing");
      setStyle(li, {
        borderColor: "#DDD",
        background: "#DDD"
      });

      previews.removeChild(sample);
      loaded[url] = false;

      if(previews.children.length === 1) {
        switchPanes(true);
        previews.querySelector("h1").classList.remove("hidden");
      }  

      return false;
    });

    previews.appendChild(sample);
    switchPanes(true);
    loaded[url] = sample;
  }

  else {

    li.classList.remove("previewing");
    setStyle(li, {
      borderColor: "#DDD",
      background: "#DDD"
    });

    previews.removeChild(loaded[url]);
    switchPanes(false);
    loaded[url] = false; 

    if(previews.children.length === 1) {
      previews.querySelector("h1").classList.remove("hidden");
    }  
  }

}