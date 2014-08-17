var main = document.querySelector("main");

/**
 * ..
 */
function success(total) {
  alert("fragment" + (total>1?"s":"") + " uploaded.");
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
 *
 */
function setColor(idx, rgb, color, img) {
  var d = main.querySelector(".s"+idx);
  d.querySelector("input.dominant").value = rgb.join(',');
  d.querySelector("label.dominant").style.background = color;
  img.style.border = "10px solid "+color;
  img.style.borderWidth = "10px 0";
}

/**
 * Figure out the dominant colour
 * see https://github.com/leeoniya/RgbQuant.js
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
  return img;
}

function getTemplate(idx) {
  var div = document.createElement("div");
  div.classList.add("sample");
  div.classList.add("s"+idx);
  div.innerHTML = [
  '  <label>Company:</label><input class="company" type="text">',
  '  <label>Ink name:</label><input class="inkname" type="text">',
  '  <label class="dominant">&nbsp;&nbsp;&nbsp;&nbsp;</label>',
  '  <input class="dominant" type="hidden">',
  '  <hr>',
  '  <p class="colors">Dominant color information for this image (click one to override the best-estimated dominant color): </p>',
  '  <hr>',
  '  <img style="display:hidden;">',
  '  <hr>'
  ].join('\n');
  return div;
};

/**
 *
 */
function buildFragment(idx) {
  var container = getTemplate(idx);
  main.appendChild(container);
  return container;
}

/**
 * do color quantization to find the most important color
 */
function performAnalysis(container, c, idx, total) {
  var p = container.querySelector("p.colors");
  var img = quantize(c, p, idx, total);
  var target = container.querySelector("img");
  container.replaceChild(img, target);
}

/**
 *
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
      img = dataContainer.querySelector("img");
      datauri = img.src;
      thumburi = (function() {
        var sc = document.createElement("canvas");
        sc.width = 125;
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
 * ..
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
