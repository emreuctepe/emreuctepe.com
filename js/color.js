"use strict";

// hsl(rastgele, %80, %65) formatinda canli bir renk uretir.
// Eskiden ayni is icin 35KB'lik tinycolor yukleniyordu; hsl() string'i CSS ve SVG
// (fill/color) tarafinda dogrudan gecerli oldugu icin rgb'ye cevirmeye gerek yok.
// mv.js ve random-link-color.js bu yardimciyi paylasir (bkz index.html script sirasi).
window.randomVividColor = function randomVividColor() {
  return "hsl(" + Math.floor(Math.random() * 360) + ", 80%, 65%)";
};
