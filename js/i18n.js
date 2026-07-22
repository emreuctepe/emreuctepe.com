"use strict";

// Bu script mv.js'ten ONCE calismali (index.html'de script sirasina dikkat) -
// mv.js sayfa yuklenirken metni klonlayip glitch efektine hazirliyor, o klonlama
// olmadan once metnin dogru dilde olmasi lazim. Ceviri sozlukleri (lang/*.js)
// fetch degil, normal <script src> ile senkron yuklendigi icin bu mumkun.
(function() {
  let supported = ['tr', 'en', 'ja'];
  let params = new URLSearchParams(window.location.search);
  let lang = params.get('lang') || localStorage.getItem('lang');
  if (!lang) {
    // Ilk ziyaret: URL'de ?lang= yok, localStorage'da secim yok - tarayicinin/
    // isletim sisteminin dilini dene, desteklenmiyorsa Turkce'ye dus.
    let browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
    lang = browserLang;
  }
  if (supported.indexOf(lang) === -1) {
    lang = 'tr';
  }

  let dict = window.I18N && window.I18N[lang];
  if (dict) {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      let key = el.getAttribute('data-i18n');
      if (dict[key] != null) {
        el.textContent = dict[key];
      }
    });
  }
  document.documentElement.lang = lang;

  document.querySelectorAll('#lang-switcher a').forEach(function(a) {
    if (a.getAttribute('data-lang') === lang) {
      a.classList.add('active');
    }
    a.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('lang', a.getAttribute('data-lang'));
      window.location.reload();
    });
  });
})();
