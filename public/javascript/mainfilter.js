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

/**
*
*/
var filterHue = (function(){
  
  // generate the hue-spectrum-map-image-thing
  var w = 360;
  var h = 22;
  var cvs = document.createElement("canvas");
  cvs.classList.add("rangepicker");
  cvs.width=w;
  cvs.height=h;
  var ctx = cvs.getContext("2d");
  for(var i=0; i<w; i++) {
    color = "hsl(" + i + ", 100%, 50%)";
    ctx.strokeStyle = color;
    ctx.beginPath();    
    ctx.moveTo(i,0);
    ctx.lineTo(i,h);
    ctx.stroke();
    ctx.closePath();
  }
  var img = new Image();
  img.height = w;
  img.width = h;
  img.src = cvs.toDataURL("image/png");

  // set up user interactio for selecting a start/end range
  var startmark = 0;
  var endmark = w;
  var marking = false;

  function mousemove(e) {
    cvs.width = w;
    ctx.drawImage(img,0,0);
    if(marking) {
      endmark = e.offsetX;
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(startmark < endmark ?  startmark : endmark, 0, Math.abs(startmark-endmark), h);
    }
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(e.offsetX, 0);
    ctx.lineTo(e.offsetX, h);
    ctx.stroke();
    ctx.closePath();
    if(marking) {
      ctx.beginPath();
      ctx.moveTo(startmark, 0);
      ctx.lineTo(startmark, h);
      ctx.stroke();
      ctx.closePath();
    }
  }

  cvs.addEventListener("mousemove", mousemove);

  function mousedown(e) {
    startmark = e.offsetX;
    marking = true;
  }

  cvs.addEventListener("mousedown", mousedown);

  function mouseup(e) {
    marking = false;
  }

  cvs.addEventListener("mouseup", mouseup);

  var button = false;

  var reset = document.createElement("button");
  reset.innerHTML = "reset hues";
  reset.onclick = function() {
    button.classList.remove("active");
    removeClass(allitems, "hide-hue");
    if(reset.parentNode) reset.parentNode.removeChild(reset);
  };

  // return the actual UX for the hue filter
  return function(e) {
    button = e;
    button.classList.add("active");
    button.parentNode.appendChild(cvs);
    if(reset.parentNode) reset.parentNode.removeChild(reset);   
    cvs.addEventListener("mouseup", function(e) {
      if(cvs.parentNode) cvs.parentNode.removeChild(cvs);
      button.parentNode.appendChild(reset);

      var comp  = Math.PI*2/360;
      var start = (startmark < endmark ? startmark : endmark) * comp;
      var end   = (startmark < endmark ? endmark : startmark) * comp;

      addClass(allitems, "hide-hue");
      allitems.filter(function(li) {
        var H = parseFloat(li.getAttribute("data-hue"));
        return start <= H && H <= end;
      }).forEach(function(li) {
        li.classList.remove("hide-hue");
      });

    });    
  }
}());
