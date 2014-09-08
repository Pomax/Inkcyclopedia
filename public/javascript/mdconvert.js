function convert_md(element) {
  element.innerHTML = marked(element.textContent);
}

Array.prototype.slice.call(document.querySelectorAll(".markdown")).forEach(convert_md);
