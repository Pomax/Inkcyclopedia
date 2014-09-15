/**
 * Convert all .markdown elements
 */
(function() {
  find(".markdown").forEach(function(e) {
    e.html(marked(e.html()));
  });
}());
