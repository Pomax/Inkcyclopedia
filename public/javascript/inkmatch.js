/**
 *
 */
var handleDroppedData = (function() {
  var tau = Math.PI * 2;
  var start = find("input[type=range].start");
  var end = find("input[type=range].end");

  var filterHue = function(hsl, i) {
    i = i || 5;
    var h = hsl.h;
    start.value = 360 * h - i;
    if(start.value < 0) { start.value += tau; }
    end.value = 360 * h + i;
    start.update();
    end.update();
    InkFilter.filterSaturation(hsl.s - 0.1, hsl.s + 0.1);
    InkFilter.filterLightness(hsl.l - 0.1, hsl.l + 0.1);
  };

  function performAnalysis(c) {
    var opts = { colors: 10, boxSize: [200,200], initColors: 256 };
    var q = new RgbQuant(opts);
    var img = new Image();
    img.onload = function() {
      q.sample(img);

      var threshold = 150;
      var neutral = 15;
      var pal = q.palette(true, true)
                .filter(function(rgb) {
                  if (rgb[0]<threshold && rgb[1]<threshold && rgb[2]<threshold) return true;
                  var d1 = Math.abs(rgb[0] - rgb[1]);
                  var d2 = Math.abs(rgb[1] - rgb[2]);
                  var d3 = Math.abs(rgb[2] - rgb[0]);
                  return !(d1<neutral && d2<neutral && d3<neutral);
                })
                .map(function(rgb) {
                  return {
                    hsl: ColorConverter.rgbToHSL(rgb[0], rgb[1], rgb[2]),
                    color: "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"
                  };
                });

      var ul = create("ul", { class: "matchlist"});
      pal.forEach(function(c) {
        var li = create("li").css({
          width: (100/pal.length) + "%",
          background: c.color,
        }).set({
          "data-hue": tau * c.hsl.h,
          "data-saturation": c.hsl.s,
          "data-lightness": c.hsl.l
        }).listen("click", function(evt) {
          find(".img-filter ul li.selected").classes().remove("selected");
          evt.target.classes().add("selected");
          filterHue(c.hsl);
        });
        ul.add(li);
      });

      find("div.hue-filter").classes().add("hidden");
      find("div.img-filter").html("").add(ul).classes().remove("hidden");

      filterHue(pal[0].hsl);
      ul.get(0).classes().add("selected");

      find(".drag-and-drop").classes().add("hidden");
    };
    img.src = c.toDataURL("image/png");
  }

  function analyse(dataURI) {
    var j = new JpegImage();
    j.onload = function() {
      var c = document.createElement("canvas");
      c.width = j.width;
      c.height = j.height;
      var ctx = c.getContext("2d");
      var d = ctx.getImageData(0,0,j.width,j.height);
      j.copyToImageData(d);
      ctx.putImageData(d, 0, 0);
      performAnalysis(c);
    };
    j.load(dataURI);
  }

  return analyse;
}());

(function findInkMatch() {
  var scr = create("script", {src: ""});
  find("head").add(scr);

  find("button.inkmatch").listen("click", function() {
    var div = find(".drag-and-drop.hidden").classes().remove("hidden");
  });

  find(".hue-reset").listen("click", function() {
    find("div.img-filter").html("").classes().add("hidden");
    find("div.hue-filter").classes().remove("hidden");
  });

  find(".drag-and-drop button.cancel").listen("click", function() {
    find(".drag-and-drop").classes().add("hidden");
  });

}());
