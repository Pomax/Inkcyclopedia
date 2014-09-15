/**
 *
 */
schedule(function() {

  var allitems = find("li.ink.card");

  function filterCompany(e) {
    var name = e;

    if (name instanceof HTMLSelectElement) {
      e.classes().add("active");
      name = name.options[name.selectedIndex].value.trim();
      if(name === "") {
        e.classes().remove("active");
        allitems.classes().remove("hide-company");
        return;
      }
    }

    if (!name.forEach) { name = [name]; }
    allitems.classes().add("hide-company");

    name.forEach(function(c) {
      c = c.replace(/\W/g,'-')
      find("li.ink.card .company."+c).forEach(function(e) {
        e.parent().classes().remove("hide-company");
      });
    });
  }

  function filterName(e) {
    var name = e;

    if (name instanceof HTMLInputElement) {
      e.classes().add("active");
      name = name.value.trim();
      if(name === "") {
        e.classes().remove("active");
        allitems.classes().remove("hide-name");
        return;
      }
    }

    allitems.classes().add("hide-name");
    name = name.replace(/\W/g,'-').toLowerCase();

    allitems.filter(function(li) {
      var classes = li.querySelector(".name").getAttribute("class");
      return classes.toLowerCase().indexOf(name) > -1;
    }).forEach(function(li) {
      li.classes().remove("hide-name");
    });
  }

  function getCoordinates(e) {
    return {
      x: (e.pageX - e.target.position().left)|0,
      y: (e.pageY - e.target.position().top)|0
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

    allitems.classes().add("hide-hue").filter(function(li) {
      var H = parseFloat(li.getAttribute("data-hue"));
      if(epsilon < 0.1) return true;
      if(hue_end > tau) return hue_start <= H || H <= endmod;
      return hue_start <= H && H <= hue_end;
    }).forEach(function(li) {
      li.classes().remove("hide-hue");
    });
  }

  document.listen("hue-update", filterHue);

  find(".hue-reset").listen("click", function(evt) {
    var start = find("input[type=range].start")
    start.value = 0;
    start.update();
    var end = find("input[type=range].end");
    end.value = 360;
    end.update();
  });


  /**
   * Change background color as we scroll
   */
  (function() {
    var m = find(".swatches");
    var d = m.parent();
    var s = 15;
    var l = 25;

    var scrollHandler = function() {
      var pc = parseInt( 100 * d.scrollTop / (d.scrollHeight - d.clientHeight) );
      pc = (pc - 5) % 100;
      pc = hue_start + (hue_end-hue_start)*pc/100;
      var h = pc * 360/tau;
      var color = "hsl(" + h + ", "+s+"%, "+l+"%)";
      body.css({ background: color});
    };

    d.listen("scroll", scrollHandler);
    scrollHandler();
    document.listen("hue-update", scrollHandler);
  }());


  function randomSort() {
    allitems.sort( function(_a,_b) {
      return 2 * Math.random() - 1;
    }).forEach(function(e) {
      e.parentNode.appendChild(e);
    });
  }

  function sortAlphabet() {
    allitems.sort( function(_a,_b) {
      var a = _a.find(".company").text() + _a.find(".name").text();
      var b = _b.find(".company").text() + _b.find(".name").text();
      return a == b ? 0 : a < b ? -1 : 1;
    }).forEach(function(e) {
      e.parent().add(e);
    });
  }

  /**
   * Sorting
   */
  function sortElementsBy(select) {
    var attr = select.options[select.selectedIndex].value;
    if(attr==="random") return randomSort();
    if(attr==="alphabetically") return sortAlphabet();
    allitems.sort( function(_a,_b) {
      var a = parseFloat(_a.get("data-"+attr));
      var b = parseFloat(_b.get("data-"+attr));
      var c = a-b;
      if (c===0) {
        a = _a.find(".company").text() + " " + _a.find(".name").text();
        b = _b.find(".company").text() + " " + _b.find(".name").text();
        return a<b ? -1 : 1;
      }
      return c;
    }).forEach(function(e) {
      e.parent().add(e);
    });
  }

  sortElementsBy({options: [{value:"hue"}], selectedIndex: 0});

  window.InkFilter = {
    filterCompany: filterCompany,
    filterName: filterName,
    filterHue: filterHue,
    sortElementsBy: sortElementsBy
  }

});

