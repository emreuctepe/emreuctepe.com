"use strict";

(function() {
  let color = window.randomVividColor();
  document.documentElement.style.setProperty('--inline-link-color', color);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="${color}"/></svg>`;
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.type = 'image/svg+xml';
  favicon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
})();
