var main = document.querySelector("main");

/**
 * ink successfully uploaded
 */
function success(total) {
  alert("Sample" + (total>1?"s":"") + " submitted. Once verified, it'll show up on the site.\nUntil then, it's listed on http://inkcyclopedia.org/unverified");
}

/**
 * ink upload failed
 */
function failure(err) {
  alert("Sample submission failed. For now, please refer to your\ndev tools console and network tab to find out why.");
}

/**
 * set the visibly dominant color for an ink sample
 */
function setColor(idx, rgb, color) {
  var d = main.querySelector(".s"+idx);
  d.querySelector("input.dominant").value = rgb.join(',');
  d.querySelector("label.dominant").style.background = color;
  var img = d.querySelector(".imagecontainer canvas");
  img.style.borderColor = color;
  img.classList.add("bordered");
}

/**
 * Figure out the dominant color use the color quantizer at
 * https://github.com/leeoniya/RgbQuant.js
 */
function quantize(c, p, idx, total) {
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
          setColor(idx, rgb, color, img);
        }
      }(rgb, color, img));
      if(i===0) { cinfo.click(); }
      p.appendChild(cinfo);
    }
  };
  img.src = c.toDataURL("image/png");
  return {
    img: img,
    canvas: c
  };
}

/**
 * generate a single ink sample's HTML skeleton
 */
function getTemplate(idx) {
  var template = document.querySelector("script[type='html/template']");
  var div = document.createElement("div");
  div.classList.add("sample");
  div.classList.add("s"+idx);
  div.innerHTML = template.innerHTML;
  return div;
};

/**
 * build a template with the correct sequence information
 */
function buildFragment(idx) {
  var container = getTemplate(idx);
  main.appendChild(container);
  return container;
}

/**
 * add a cropping box
 */
function addCropBox(container, result) {
  var c = result.canvas;
  var ctx = c.getContext("2d");
  // we need to compensate for CSS scaling!
  var dims = c.getBoundingClientRect();
  var fw = c.width/dims.width;
  var fh = c.height/dims.height;
  // set up the cropping functionality
  var sx, sy, ex, ey;
  var recording = false;
  c.addEventListener("mousedown", function(e) {
    recording = true;
    sx = e.offsetX * fw;
    sy = e.offsetY * fh - (c.classList.contains("bordered") ? 10 : 0);
  });
  c.addEventListener("mousemove", function(e) {
    if(recording) {
      e.stopPropagation();
      e.preventDefault();
      ex = e.offsetX * fw;
      ey = e.offsetY * fh - (c.classList.contains("bordered") ? 10 : 0);
      c.width = c.width;
      ctx.drawImage(result.img,0,0);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(sx,sy,ex-sx,ey-sy);
      ctx.strokeStyle = "black"
      ctx.strokeRect(sx,sy,ex-sx,ey-sy);
      return false;
    }
  });
  c.addEventListener("mouseup", function(e) {
    recording = false;
    // build crop image
    c.width = c.width;
    ctx.drawImage(result.img,0,0);
    var cropcanvas = document.createElement("canvas");
    cropcanvas.width = ex - sx;
    cropcanvas.height = ey - sy;
    var cropctx = cropcanvas.getContext("2d");
    cropctx.drawImage(result.img, -sx, -sy);
    // show crop
    var cregion = container.querySelector(".crop");
    cregion.innerHTML ="";
    cregion.appendChild(cropcanvas);
  });
}

/**
 * perform color analysis on the submitted image
 */
function performAnalysis(container, c, idx, total) {
  var p = container.querySelector("p.colors");
  var result = quantize(c, p, idx, total);
  var target = container.querySelector("img");
  target.parentNode.replaceChild(result.canvas, target);
  addCropBox(container, result);
}

/**
 * post the ink data to the server. The postObject is sent
 * as an array of inks.
 */
function processAndSubmit(postObject, total) {
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
      success(total);
    }
  };
  xhr.send(JSON.stringify({ samples: postObject }));
}

/**
 * add a "publish" button and hook it up so that it submits all samples
 */
function setupPublishButton(total) {
  var button = document.createElement("button");
  button.classList.add("publish");
  button.innerHTML = "Publish " + (total>1 ? "these":"this") + " sample" + (total>1 ? "s":"");

  button.onclick = function() {
    var postObject = [];
    var dataContainer;
    var img;
    var datauri;
    var thumburi;

    for (var i=0; i<total; i++) {
      dataContainer = document.querySelector("div.s"+i);
      img = dataContainer.querySelector(".imagecontainer canvas");
      datauri = img.toDataURL("image/png");
      thumburi = (function() {
        var sc = document.createElement("canvas");
        sc.width = 350;
        sc.height = img.height / (img.width/sc.width);
        var simg = new Image();
        simg.src = datauri;
        var sctx = sc.getContext("2d");
        sctx.drawImage(simg,0,0,sc.width,sc.height);
        return sc.toDataURL("image/png");
      }());

      postObject.push({
        datauri: datauri,
        thumburi: thumburi,
        cropuri: dataContainer.querySelector("span.crop canvas").toDataURL("image/png"),
        company: dataContainer.querySelector("input.company").value.trim(),
        inkname: dataContainer.querySelector("input.inkname").value.trim(),
        dominant: dataContainer.querySelector("input.dominant").value.trim()
      });
    }

    processAndSubmit(postObject, total);
  };
  main.appendChild(button);
}

/**
 * when an image is, or multiple images are dropped onto the dropzone,
 * load a new template for each and determine the dominant color of
 * each dropped image.
 */
function handleDroppedData(dataURI, idx, total) {
  if(idx===0) { main.innerHTML = ""; }

  var container = buildFragment(idx);

  var j = new JpegImage();
  j.onload = function() {
    var c = document.createElement("canvas");
    c.width = j.width;
    c.height = j.height;
    var ctx = c.getContext("2d");
    var d = ctx.getImageData(0,0,j.width,j.height);
    j.copyToImageData(d);
    ctx.putImageData(d, 0, 0);
    performAnalysis(container, c, idx, total);
    if (idx+1 === total) {
      setupPublishButton(total);
    }
  };

  j.load(dataURI);
}
