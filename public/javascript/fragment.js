var main = document.querySelector("main");

/**
 * ..
 */
function success() {
  alert("fragment uploaded.");
  window.location = window.location;
}

/**
 * ..
 */
function failure(err) {
  alert("upload failed.", err);
}

/**
 * ..
 */
function processAndSubmit(datauri, thumburi, analysis) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "submit", true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.status >= 400) {
      xhr.onreadystatechange = function(){};
      failure(new Error({
        status: xhr.status,
        readyState: xhr.readyState
      }));
    }
    if (xhr.status === 200 && xhr.readyState === 4) {
      xhr.onreadystatechange = function(){};
      success();
    }
  };
  var obj = {
    company:  document.getElementById("company").value,
    inkname:  document.getElementById("inkname").value,
    dominant: document.getElementById("dominant").value,
    imageData: datauri,
    thumbnail: thumburi
  };
  xhr.send(JSON.stringify(obj));
}

/**
 *
 */
function setColor(rgb, color, img) {
  main.querySelector("#dominant").value = rgb.join(',');
  main.querySelector("label[for=dominant]").style.background = color;
  img.style.border = "10px solid "+color;
  img.style.borderWidth = "10px 0";
}

/**
 * Figure out the dominant colour
 * see https://github.com/leeoniya/RgbQuant.js
 */
function quantize(c, p) {
  var img = new Image();
  img.onload = function() {
    var opts = { colors: 10, boxSize: [200,200], initColors: 256 };
    var q = new RgbQuant(opts);
    q.sample(img);

    var pal = q.palette(true, true);
    var threshold = 150;
    var neutral = 15;
    pal = pal.filter(function(rgb) {
      if (rgb[0]<threshold && rgb[1]<threshold && rgb[2]<threshold) return true;
      var d1 = Math.abs(rgb[0] - rgb[1]);
      var d2 = Math.abs(rgb[1] - rgb[2]);
      var d3 = Math.abs(rgb[2] - rgb[0]);
      // weed out neutrals as best we can
      return !(d1<neutral && d2<neutral && d3<neutral);
    });
    //console.log(pal);

    var rgb, cinfo;
    for(var i = 0; i <pal.length; i++) {
      rgb = pal[i];
      cinfo = document.createElement("span");
      cinfo.classList.add("color-info");
      color = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
      cinfo.style.background = color;
      cinfo.style.border = color;
      cinfo.onclick = (function(rgb, color, img) {
        return function() {
          setColor(rgb, color, img);
        }
      }(rgb, color, img));
      if(i===0) { cinfo.click(); }
      p.appendChild(cinfo);
    }

    main.appendChild(img);        
  };
  img.src = c.toDataURL("image/png");
}


/**
 * ..
 */
function setupPublish(c) {

  // do image processing!
  RGBAnalyse.analyse(c, function(err, data) {
    var p = document.createElement("p");
    p.innerHTML = "Dominant color information for this image (click one to override the best-estimated dominant color): ";
    main.appendChild(p);
    main.appendChild(document.createElement("hr"));

    // do color quantization to find the most important color
    quantize(c, p);

    // Allow processing of sample submission
    var button = main.querySelector("button");
    button.onclick = function() {
      if (!document.getElementById("company").value) {
        alert("you'll need to fill in the company that made this ink");
      }

      else if (!document.getElementById("inkname").value) {
        alert("you'll need to fill in the name for this ink");
      }

      else {
        var datauri = c.toDataURL("image/png");
        var thumburi = (function() {
          var sc = document.createElement("canvas");
          sc.width = 125;
          sc.height = c.height / (c.width/sc.width);
          var simg = new Image();
          simg.src = datauri;
          var sctx = sc.getContext("2d");
          sctx.drawImage(simg,0,0,sc.width,sc.height);
          return sc.toDataURL("image/png");
        }());
        processAndSubmit(datauri, thumburi, data.analysis);
      }
    };
    button.removeAttribute("disabled");
  });
}

/**
 * ..
 */
function handleDroppedData(dataURI) {
  document.getElementById("company").focus();
  var j = new JpegImage();

  j.onload = function() {
    var c = document.createElement("canvas");
    c.width = j.width;
    c.height = j.height;
    var ctx = c.getContext("2d");
    var d = ctx.getImageData(0,0,j.width,j.height);
    j.copyToImageData(d);
    ctx.putImageData(d, 0, 0);
    setupPublish(c);
  };

  j.load(dataURI);
}
