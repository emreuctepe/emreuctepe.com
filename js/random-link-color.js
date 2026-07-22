"use strict";

// Sayfa her yenilendiginde, glitch seritlerinde kullanilan ayni formulle
// (hsl(hue, 80%, 65%)) rastgele bir renk uretip paragraf ici linklere uygular.
// CSS tarafinda "section p a" bu degiskeni okuyor (bkz css/index.css) - yeni bir
// linki bu renge dahil etmek icin ekstra bir sey yapmaya gerek yok, sadece <a>
// etiketine sarmak yeterli.
(function() {
  let hue = Math.floor(Math.random() * 360);
  let color = tinycolor(`hsl(${hue}, 80%, 65%)`).toRgbString();
  document.documentElement.style.setProperty('--inline-link-color', color);

  // Favicon: ayni renkle bir daire ciziyoruz, SVG'yi data URI olarak favicon
  // linkine atiyoruz. Statik bir dosya olmadigi icin sayfa her yenilendiginde
  // yeni renk uretilir.
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
