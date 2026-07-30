"use strict";

// Bu script mv.js'ten ONCE calismali (index.html'de script sirasina dikkat) -
// mv.js sayfa yuklenirken metni klonlayip glitch efektine hazirliyor, o klonlama
// olmadan once metnin dogru dilde olmasi lazim. Ceviri tablosu (lang/strings.js)
// fetch degil, normal <script src> ile senkron yuklendigi icin bu mumkun.
//
// DIL MIMARISI: tum diller tek bir tabloda, key basina bir satir halinde
// (lang/strings.js). Bir metnin karsiligi bos ise ("" veya tanimsiz) o elemana
// hic dokunulmaz, index.html'in govdesindeki Turkce metin oldugu gibi kalir.
// Yani JS yuklenmese/kapali olsa bile site Turkce olarak calisir.
//
// IKI CALISMA MODU var:
//   1. Kok sayfa (index.html) - Turkce kaynak. Dil secimi calisma aninda,
//      ?lang= / localStorage ile yapilir; metin JS ile degistirilir.
//   2. build.py'nin urettigi /en/, /ja/ sayfalari - metin zaten HTML'e gomulu.
//      <html data-i18n-static> tasirlar; burada ceviri ADIMI ATLANIR, sadece
//      dil secicinin gorunumu ve tiklama davranisi ayarlanir. Bu sayfalarda
//      secici gercek <a href> oldugu icin JS kapaliyken de calisir.
(function() {
  let SUPPORTED = ['tr', 'en', 'ja'];
  let isStatic = document.documentElement.hasAttribute('data-i18n-static');
  let lang;

  if (isStatic) {
    // Sayfanin dili URL'den belli; kullanicinin onceki secimi burada gecersiz.
    lang = document.documentElement.lang;
  } else {
    let params = new URLSearchParams(window.location.search);
    lang = params.get('lang') || localStorage.getItem('lang');
    if (!lang) {
      // Ilk ziyaret: URL'de ?lang= yok, localStorage'da secim yok - tarayicinin/
      // isletim sisteminin dilini dene, desteklenmiyorsa Turkce'ye dus.
      lang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
    }
    if (SUPPORTED.indexOf(lang) === -1) {
      lang = 'tr';
    }

    // Uc yerlestirme bicimi var, ucu de ayni tabloyu kullanir:
    //   data-i18n         -> elemanin metni      (<h2 data-i18n="about_title">)
    //   data-i18n-content -> content attribute'u (<meta data-i18n-content="page_desc">)
    //   data-i18n-label   -> aria-label          (ekran okuyucu metni)
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
      // Projeler o an ACIKSA, dil degisikliginden sonra acik kalsin diye
      // tek-kullanimlik bayrak birak (mv.js yeni yuklemede okuyup animasyonsuz acar).
      if (window.__projectsExpanded) {
        try { sessionStorage.setItem('keepProjects', '1'); } catch (_) {}
      }
      // Secim HER IKI modda da kaydedilir. Statik sayfada bu sart: kullanici
      // /en/ uzerinden TR'ye tiklayinca tarayici koke gider ve kok sayfa dili
      // localStorage'dan okur - yazilmazsa orada eski secim ("en") duruyor ve
      // Turkce isteyen kullaniciya Ingilizce gosterilirdi.
      try { localStorage.setItem('lang', a.getAttribute('data-lang')); } catch (_) {}
      if (isStatic) {
        return; // href gercek bir sayfaya gidiyor; tarayici devrali.
      }
      e.preventDefault();
      window.location.reload();
    });
  });
})();
