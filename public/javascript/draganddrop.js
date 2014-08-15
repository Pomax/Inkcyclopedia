/**
 * Try to enable drag and drop for files
 */
(function() {

  function cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  function readFileData(e) {
    var file = e.dataTransfer.files[0],
        reader = new FileReader(),
        data;

    reader.addEventListener("loadend", function (e) {
      data = this.result;
      handleDroppedData(data);
    });

    reader.readAsDataURL(file);  
  }

  function setup() {
    var holders = document.querySelectorAll(".drag-and-drop"),
        i=0,
        last=holders.length,
        holder;

    for(i=0; i<last; i++) {
      holder = holders[i];

      var highlight = function (e) { holder.classList.add('hover'); return cancel(e); };
      var unhighlight = function (e) { holder.classList.remove('hover'); return cancel(e); };

      holder.addEventListener("dragenter", highlight);
      holder.addEventListener("dragover", cancel);
      holder.addEventListener("dragleave", unhighlight);
      holder.addEventListener("dragexit", unhighlight);

      holder.addEventListener("drop", function (e) {
        readFileData(e);
        return unhighlight(e);
      });
    }
  }

  var dnd = function() {
    document.removeEventListener("DOMContentLoaded", dnd, false);
    if (typeof window.FileReader === 'undefined') {}
    else { setup(); }
  };

  document.addEventListener("DOMContentLoaded", dnd, false);
}());