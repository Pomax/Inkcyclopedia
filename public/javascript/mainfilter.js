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
function filterHue(e) {
  var data = e.detail;
  var tau = Math.PI*2;
  var start = (data.start * tau/360);
  var end   = (data.end * tau/360);
  var epsilon = (((Math.abs(start - end + tau) % tau)*100)|0) / 100;
  var endmod = end % tau;

  addClass(allitems, "hide-hue");
  allitems.filter(function(li) {
    var H = parseFloat(li.getAttribute("data-hue"));
    if(epsilon < 0.1) return true;
    if(end > tau) return start <= H || H <= endmod;
    return start <= H && H <= end;
  }).forEach(function(li) {
    li.classList.remove("hide-hue");
  });
}

document.addEventListener("hue-update", filterHue);
