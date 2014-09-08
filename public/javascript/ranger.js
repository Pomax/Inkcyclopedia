(function() {

  // generate the hue-spectrum-map-image-thing
  function x() {
    var w = 3*360;
    var h = 22;
    var cvs = document.createElement("canvas");
    cvs.classList.add("rangepicker");
    cvs.width=3*w;
    cvs.height=h;
    var ctx = cvs.getContext("2d");
    for(var i=0; i<=w; i++) {
      color = "hsl(" + (i%360) + ", 100%, 50%)";
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(i,0);
      ctx.lineTo(i,h);
      ctx.stroke();
      ctx.closePath();
    }
    return cvs.toDataURL("image/png");
  }

  // meh
  function listen(e, en, fn) { e.addEventListener(en, fn); }
  function forget(e, en, fn) { e.removeEventListener(en, fn); }

  // show the hue information based on the caps + slider
  function updateInformation() {
    var spectrum = document.querySelector("#spectrum");
    var start = document.querySelector("input.start");
    var end = document.querySelector("input.end");

    var offset = (parseInt(spectrum.getAttribute("data-offset")) + 360) % 360;

    var s_val = parseInt(start.value) + offset;
    if(s_val < 0) s_val += 360;

    var e_val = parseInt(end.value) + offset;
    if(e_val < 0) e_val += 360;
    if(e_val <= s_val) e_val += 360;

    var result = {
      start: s_val,
      end: e_val,
      offset: offset
    };

    document.dispatchEvent(new CustomEvent("hue-update", { detail: result }));
  }

  /**
   * THINGS FOR SPECTRUM SLIDER
   */
  (function() {

    var spectrum = document.getElementById("spectrum");
    var $ = spectrum.style;
    $.background = "url(" + x() + ") repeat";
    $.backgroundPosition = "-360px 0px";

    var evtHandler = {
      left: -360,
      mark: false,
      diff: 0,

      mousedown: function(e) {
        forget(spectrum, "mousedown", evtHandler.mousemove);
        listen(document, "mousemove", evtHandler.mousemove);
        listen(document, "mouseup",   evtHandler.mouseup);
        e.stopPropagation();
        evtHandler.mark = e.screenX;
      },

      mousemove: function(e) {
        if(evtHandler.mark) {
          evtHandler.diff = e.screenX - evtHandler.mark;
          var pos = (evtHandler.left + evtHandler.diff);
          while (pos > 0)    { pos -= 360; }
          while (pos < -720) { pos += 360; }
          $.backgroundPosition = pos + "px 0px";
          var offset = (pos + 720)%360;
          spectrum.setAttribute("data-offset", -offset);
          updateInformation();
          e.stopPropagation();
        }
      },

      mouseup: function(e) {
        evtHandler.mark = false;
        evtHandler.left = evtHandler.left + evtHandler.diff;
        forget(document, "mouseup", evtHandler.mouseup);
        forget(document, "mousemove", evtHandler.mousemove);
        listen(spectrum, "mousedown", evtHandler.mousedown);
      }
    };

    listen(spectrum, "mousedown", evtHandler.mousedown);
  }());


  /**
   * THINGS FOR HUE CAPS
   */
  (function() {

    var ls = document.querySelector(".left.shutter");
    var start = document.querySelector(".start");

    var update_start = function(e) {
      ls.style.width = start.value + "px";
      updateInformation();
    };
    listen(start, "input", update_start);
    start.update = update_start;

    var rs = document.querySelector(".right.shutter");
    var end = document.querySelector(".end");

    var update_end = function(e) {
      rs.style.width = (360 - end.value) + "px";
      updateInformation();
    };
    listen(end, "input", update_end);
    end.update = update_end;

  }());
}());