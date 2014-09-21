/**
 * Try to enable drag and drop for files
 */
(function setupDragAndDrop() {

  function cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  function readFileData(e) {
    var files = e.dataTransfer.files;
    var i = 0;
    var total = files.length;
    var data;


    function next() {
      if(i===total) return;
      var reader = buildReader(i, total);
      reader.readAsDataURL(files[i]);
      i++;
    }

    function buildReader(idx, total) {
      var reader = new FileReader();
      reader.addEventListener("loadend", function (e) {
        data = this.result;
        handleDroppedData(data, idx, total);
        next();
      });
      return reader;
    }

    next();

  }

  function setup() {
    var holders = find(".drag-and-drop"),
        i=0,
        last=holders.length,
        holder;

    holders.forEach(function(holder, i) {

      var highlight = function (e) { holder.classes().add('hover'); return cancel(e); };
      var unhighlight = function (e) { holder.classes().remove('hover'); return cancel(e); };

      holder.listen("dragenter", cancel);
      holder.listen("dragover", cancel);

      holder.listen("dragleave", cancel);
      holder.listen("dragexit", cancel);

      holder.listen("drop", function (e) {
        cancel(e);
        readFileData(e);
        return false;
      });
    });
  }

  schedule(function() {
    if (typeof window.FileReader === 'undefined') {}
    else { setup(); }
  });

}());
