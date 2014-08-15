var main = document.querySelector("main");

function success() {
  alert("fragment uploaded.");
  window.location = window.location;
}

function failure(err) {
  alert("upload failed.", err);
}

function processAndSubmit(datauri, analysis) {
  console.log(datauri);
  console.log(analysis);
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
    image: datauri
  };
  xhr.send(JSON.stringify(obj));
}

function setupPublish(c) {
  
  RGBAnalyse.analyse(c, function(err,data) {
    var p = document.createElement("p");
    p.innerHTML = "Dominant color information for this image: ";
    main.appendChild(p);

    var dataurl = c.toDataURL("image/png");
    huey(dataurl, function(error, rgb, image) {

      var cinfo = document.createElement("span");
      cinfo.classList.add("color-info");
      color = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
      console.log(rgb, color);
      cinfo.style.background = color;
      cinfo.style.border = color;
      p.appendChild(cinfo);
      main.querySelector("#dominant").value = rgb.join(',');
    });

    var button = main.querySelector("button");

    button.onclick = function() {

      if (!document.getElementById("company").value) {
        alert("you'll need to fill in the company that made this ink");
      }
      else if (!document.getElementById("inkname").value) {
        alert("you'll need to fill in the name for this ink");
      }
      else {
        processAndSubmit(c.toDataURL("image/png"), data.analysis);
      }
    };
    button.removeAttribute("disabled");
  });
}

function handleDroppedData(dataURI) {
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
