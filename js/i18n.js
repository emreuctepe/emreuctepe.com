"use strict";

(function() {
  let SUPPORTED = ['tr', 'en', 'ja'];
  let isStatic = document.documentElement.hasAttribute('data-i18n-static');
  let lang;

  if (isStatic) {
    lang = document.documentElement.lang;
  } else {
    let params = new URLSearchParams(window.location.search);
    lang = params.get('lang') || localStorage.getItem('lang');
    if (!lang) {
      lang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
    }
    if (SUPPORTED.indexOf(lang) === -1) {
      lang = 'tr';
    }

    let strings = window.STRINGS || {};
    function apply(attr, setter) {
      document.querySelectorAll('[' + attr + ']').forEach(function(el) {
        let row = strings[el.getAttribute(attr)];
        if (row && row[lang]) {
          setter(el, row[lang]);
        }
      });
    }
    apply('data-i18n',         function(el, v) { el.textContent = v; });
    apply('data-i18n-content', function(el, v) { el.setAttribute('content', v); });
    apply('data-i18n-label',   function(el, v) { el.setAttribute('aria-label', v); });

    document.documentElement.lang = lang;
  }

  document.querySelectorAll('#lang-switcher a').forEach(function(a) {
    if (a.getAttribute('data-lang') === lang) {
      a.classList.add('active');
    }
    a.addEventListener('click', function(e) {
      if (window.__projectsExpanded) {
        try { sessionStorage.setItem('keepProjects', '1'); } catch (_) {}
      }
      try { localStorage.setItem('lang', a.getAttribute('data-lang')); } catch (_) {}
      if (isStatic) {
        return;
      }
      e.preventDefault();
      window.location.reload();
    });
  });
})();
