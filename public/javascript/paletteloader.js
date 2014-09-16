/**
 * Pallete loading
 */
(function() {

  var PaletteSelection = function() {
    this.header = find("header");
    this.palette = find("header div.palette");
    this.reset = find("header div.palette .reset");
    this.reset.onclick = this.clearSelection.bind(this);
    this.save = find("header div.palette .save");
    this.save.onclick = this.saveSelection.bind(this);
  };

  PaletteSelection.prototype = {

    saveSelection: function() {
      var inkids = this.palette.find("div").map(function(d) {
        return d.item.id.replace("swatch-",'');
      });
      var qsName = prompt("Give this selection a name...");
      if(qsName) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/selections", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
          if(xhr.status === 200) {
            if (xhr.readyState === 4) {
              //alert("Selection [" + qsName + "] was saved.");
            }
          }
          else if(xhr.readyState === 4 && parseInt(xhr.status,10) >= 400) {
            alert("There was an error while trying to save your selection.");
          }
        }
        var data = {
          name: qsName,
          inks: inkids
        };
        xhr.send(JSON.stringify(data));
        console.log("saving", inkids, "as", qsName);
      }
    },

    clearSelection: function() {
      this.palette.find("div").forEach(function(d) {
        d.item.classList.remove("palette-swatch");
        this.palette.remove(d);
      }.bind(this));
      this.header.classes().remove("palette");
    },

    showAllSamples: function() {
      var srcs = this.palette.find("img").map(function(i) {
        var img = new Image();
        img.src = i.src.replace("crop", "sample");
        img.classes().add("preview-all");
        return img;
      });
      var underlay = document.createElement("div");
      underlay.classes().add("underlay");
      underlay.classes().add("palette");
      underlay.css({
        height: "100%"
      });
      document.body.add(underlay);
      srcs.forEach(function(img) {
        underlay.add(img);
      });
      underlay.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        underlay.parent().remove(underlay);
        document.find("main div.swatch.pane").classes().remove("noscroll");
        return false;
      };
    },

    removePaletteSwatch: function(li) {
      var div = li.swatch;
      return function(e) {
        this.palette.remove(div);
        li.classes().remove("palette-swatch")
        if(this.palette.children.length === 1) {
          this.header.classes().remove("palette");
        }
      }.bind(this);
    },

    // REFACTOR: this should be made using a <script text/html> template
    buildPaletteSwatch: function(li, color) {
      var div = create("div");
      div.classes().add("palette-swatch");
      div.css({ background: color });
      div.item = li;

      var img = new Image();
      img.src = li.find(".crop img").src;
      img.title = "Compare all samples";
      div.add(img);

      img.onmouseover = function(e) {
        this.palette.find("img").forEach(function(i) {
          i.classes().add("highlight");
        });
      }.bind(this);
      img.onmouseout = function(e) {
        this.palette.find("img").forEach(function(i) {
          i.classes().remove("highlight");
        });
      }.bind(this);
      img.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.showAllSamples();
        return false;
      }.bind(this);

      li.classes().add("palette-swatch")
      li.swatch = div;
      div.onclick = this.removePaletteSwatch(li);
      return div;
    },

    addToPalette: function(li) {
      this.header.classes().add("palette");
      var color = li.get("data-color");
      if(li.classes().contains("palette-swatch")) {
        return this.removePaletteSwatch(li)();
      }
      this.palette.add(this.buildPaletteSwatch(li, color));
    }
  };

  (function bind() {
    var selection = new PaletteSelection();
    find(".ink.card").forEach(function(li) {
      li.onclick = function(evt) { selection.addToPalette(li); };
      li.querySelector(".menu").onclick = function(e) { e.stopPropagation(); }
    });
  }());

}());
