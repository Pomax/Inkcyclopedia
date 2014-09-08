var allitems = array(document.querySelectorAll("li.ink.card"));

function array(a) {
  return Array.prototype.slice.call(a);
}

function addClass(qs, className, stepup) {
  stepup = stepup || 0;
  var items = (typeof qs === "string" ? array(document.querySelectorAll(qs)) : qs);
  items.forEach(function(e) {
    var c = stepup;
    while(c-->0) { e = e.parentNode; }
    e.classList.add(className);
  });
}

function removeClass(qs, className, stepup) {
  stepup = stepup || 0;
  var items = (typeof qs === "string" ? array(document.querySelectorAll(qs)) : qs);
  items.forEach(function(e) {
    var c = stepup;
    while(c-->0) { e = e.parentNode; }
    e.classList.remove(className);
  });
}

function filterCompany(e) {
  var name = e;

  if (name instanceof HTMLSelectElement) {
    e.classList.add("active");
    name = name.options[name.selectedIndex].value.trim();
    if(name === "") {
      e.classList.remove("active");
      removeClass(allitems, "hide-company");
      return;
    }
  }

  if (!name.forEach) { name = [name]; }
  addClass(allitems, "hide-company");

  name.forEach(function(c) {
    c = c.replace(/\W/g,'-')
    removeClass("li.ink.card .company."+c, "hide-company", 1);
  });
}


function filterName(e) {
  var name = e;

  if (name instanceof HTMLInputElement) {
    e.classList.add("active");
    name = name.value.trim();
    if(name === "") {
      e.classList.remove("active");
      removeClass(allitems, "hide-name");
      return;
    }
  }

  addClass(allitems, "hide-name");
  name = name.replace(/\W/g,'-').toLowerCase();

  allitems.filter(function(li) {
    var classes = li.querySelector(".name").getAttribute("class");
    return classes.toLowerCase().indexOf(name) > -1;
  }).forEach(function(li) {
    li.classList.remove("hide-name");
  });
}

function getCoordinates(e) {
  return {
    x: (e.pageX - e.target.getBoundingClientRect().left)|0,
    y: (e.pageY - e.target.getBoundingClientRect().top)|0
  };
}

/**
 * Sweet interactive hue filtering
 */
var tau = Math.PI*2;
var hue_start=0;
var hue_end=tau;

function filterHue(e) {
  var data = e.detail;
  var offset = data.offset * tau/360;

  hue_start = (data.start * tau/360);
  hue_end   = (data.end * tau/360);

  // TODO: reorder on hue slide?

  var epsilon = (((Math.abs(hue_start - hue_end + tau) % tau)*100)|0) / 100;
  var endmod = hue_end % tau;

  addClass(allitems, "hide-hue");
  allitems.filter(function(li) {
    var H = parseFloat(li.getAttribute("data-hue"));
    if(epsilon < 0.1) return true;
    if(hue_end > tau) return hue_start <= H || H <= endmod;
    return hue_start <= H && H <= hue_end;
  }).forEach(function(li) {
    li.classList.remove("hide-hue");
  });
}

document.addEventListener("hue-update", filterHue);

document.querySelector(".hue-reset").addEventListener("click", function(evt) {
  var start = document.querySelector("input[type=range].start")
  start.value = 0;
  start.update();
  var end = document.querySelector("input[type=range].end");
  end.value = 360;
  end.update();
});


/**
 * Change background color as we scroll
 */
(function() {
  var m = document.querySelector(".swatches");
  var d = m.parentNode;
  var s = 15;
  var l = 25;

  var scrollHandler = function() {
    var pc = parseInt( 100 * d.scrollTop / (d.scrollHeight - d.clientHeight) );
    pc = (pc - 5) % 100;
    pc = hue_start + (hue_end-hue_start)*pc/100;
    var h = pc * 360/tau;
    var color = "hsl(" + h + ", "+s+"%, "+l+"%)";
    document.body.style.background = color;
  };

  d.addEventListener("scroll", scrollHandler);
  scrollHandler();

  document.addEventListener("hue-update", scrollHandler);
}());


/**
 * Sorting
 */
function sortElementsBy(select) {
  var attr = select.options[select.selectedIndex].value;
  if(attr==="random") return randomSort();
  allitems.sort( function(_a,_b) {
    var a = parseFloat(_a.getAttribute("data-"+attr));
    var b = parseFloat(_b.getAttribute("data-"+attr));
    var c = a-b;
    if (c===0) {
      a = _a.querySelector(".company").textContent + " " + _a.querySelector(".name").textContent;
      b = _b.querySelector(".company").textContent + " " + _b.querySelector(".name").textContent;
      return a<b ? -1 : 1;
    }
    return c;
  }).forEach(function(e) {
    e.parentNode.appendChild(e);
  });
}

function randomSort() {
  allitems.sort( function(_a,_b) {
    return 2 * Math.random() - 1;;
  }).forEach(function(e) {
    e.parentNode.appendChild(e);
  });
}

sortElementsBy({options: [{value:"hue"}], selectedIndex: 0});
