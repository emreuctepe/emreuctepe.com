"use strict";

// TEK CEVIRI DOSYASI - her satir bir metin, diller yan yana sutunlar halinde.
//
// Ceviri eklemek/duzeltmek icin SADECE bu dosyayi duzenle. Yeni bir dil eklemek
// icin her satira yeni bir sutun ekle (ornegin de: "...") ve js/i18n.js icindeki
// SUPPORTED listesine dil kodunu yaz - baska hicbir yere dokunmaya gerek yok.
//
// Bos string ("") = "henuz cevrilmedi" demek. O durumda i18n.js metne hic
// dokunmaz, index.html'in govdesindeki Turkce metin oldugu gibi kalir. Yani
// eksik ceviri siteyi bozmaz, sadece Turkce gorunur.
//
// DIKKAT: metin hedef dilde AYNI kalacaksa (ozel isimler, alan adlari, dizi/film
// adlari) hucreyi bos birakma - Turkce metni birebir kopyala. Bos hucre build.py
// icin "cevrilmedi" demektir ve %90 esigini asagi ceker; ~19 satir boyle oldugu
// icin bos birakmak o dilin hic uretilememesine yol acar.
//
// tr sutunu index.html'deki metnin kopyasidir; ikisini birlikte guncelle
// (HTML'deki metin JS kapaliyken/yuklenmeden once gorunen metindir).
window.STRINGS = {
  // --- Sayfa meta bilgileri (<title>, description, og:*) ---
  page_title:       { tr: "Emre Üçtepe", en: "Emre Üçtepe", ja: "ヱムレ・ウチュテペ" },
  page_desc:        { tr: "Emre Üçtepe'nin kişisel sitesi — projeler, yazılar ve iletişim.", en: "Emre Üçtepe's personal site — projects, writing and contact.", ja: "" },

  // --- Erisilebilirlik metinleri (aria-label) ---
  profile_alt:      { tr: "Emre Üçtepe profil fotoğrafı", en: "Emre Üçtepe profile photo", ja: "" },
  email_label:      { tr: "E-posta gönder", en: "Send an email", ja: "" },

  // --- Baslik alani ---
  name:             { tr: "Emre Üçtepe", en: "Emre Üçtepe", ja: "ヱムレ・ウチュテペ" },
  country:          { tr: "Türkiye", en: "Türkiye", ja: "トルコ" },

  // --- Hakkimda ---
  about_title:      { tr: "Hakkımda", en: "About", ja: "" },
  about_text:       { tr: "Selam, şu an Japon Dili ve Edebiyatı(Erü) okuyorum. Kendi halimde oyunculuğa devam ediyorum. Sıkıldığımda da matematik, geometri, oyun programlama ve web uygulamaları gibi alanlarda takılıyorum.", en: "Hi. I'm studying Japanese Language and Literature at Erciyes University. I keep acting, in my own quiet way. And when I get bored I wander off into maths, geometry, game programming and web apps.", ja: "" }, // GOZDEN GECIR: kisisel metin, ton sana ait. "(Erü)" acildi.
  about_more:       { tr: "İletişime Geç", en: "Get in touch", ja: "" },

  // --- Projeler bolumu ---
  work_title:       { tr: "Projeler", en: "Projects", ja: "" },
  work_more:        { tr: "Diğer Projeler", en: "More projects", ja: "" },
  work_past:        { tr: "--------------Geçmiş----------", en: "----------Past----------", ja: "----------過去----------" },

  // Her projenin iki parcasi var: _desc = baslik, _meta = tireden sonraki aciklama.
  project_1_desc:   { tr: "Aylık Sosyal Dergi", en: "Monthly Social Magazine", ja: "毎月雑誌" },
  project_1_meta:   { tr: "dergi.com", en: "dergi.com", ja: "" },
  project_2_desc:   { tr: "Türkiye'yi tanıtmak bana mı kaldı kardeşim!", en: "Guess promoting Türkiye is down to me!", ja: "" }, // GOZDEN GECIR: deyimsel, birebir cevrilmiyor
  project_2_meta:   { tr: "YouTube Podcast", en: "YouTube Podcast", ja: "ポットキャスト" },
  project_3_desc:   { tr: "Rastgele Konu Seç", en: "Pick a Random Topic", ja: "ランドムトピックを選ぶ" },
  project_3_meta:   { tr: "emreuctepe.github.io/random-topik/", en: "emreuctepe.github.io/random-topik/", ja: "emreuctepe.github.io/random-topik/" },
  project_6_desc:   { tr: "Osman", en: "Osman", ja: "" },
  project_6_meta:   { tr: "Diriliş: Ertuğrul Dizi S5/B1-B29", en: "Resurrection Ertugrul S5/E1-E29 (TV series)", ja: "" },
  project_7_desc:   { tr: "Naci", en: "Naci", ja: "" },
  project_7_meta:   { tr: "Başarmalısın film", en: "Başarmalısın (film)", ja: "映画" },
  project_8_desc:   { tr: "Hakan", en: "Hakan", ja: "" },
  project_8_meta:   { tr: "Hayat Dediğin: Sevginin Gücü", en: "Hayat Dediğin: Sevginin Gücü", ja: "映画" },
  project_10_desc:  { tr: "Türk Hava Yolları", en: "Turkish Airlines", ja: "" },
  project_10_meta:  { tr: "Reklam Filmi", en: "Commercial", ja: "" },
  project_11_desc:  { tr: "Dettol", en: "Dettol", ja: "" },
  project_11_meta:  { tr: "Reklam Filmi (Şu an BOYKOT!)", en: "Commercial (currently BOYCOTTED!)", ja: "" },

  // Asagidakiler index.html'de su an yorum icinde - yorumu kaldirinca aktif olur.
  project_4_desc:   { tr: "Project G", en: "Project G", ja: "" },
  project_4_meta:   { tr: "İnteraktif Geometri Öğrenme platformu", en: "Interactive geometry learning platform", ja: "" },
  project_5_desc:   { tr: "benkyoutorukogo.com", en: "benkyoutorukogo.com", ja: "" },
  project_5_meta:   { tr: "Japonlar için Türkçe Öğrenme Materyalleri", en: "Turkish learning materials for Japanese speakers", ja: "" },
  project_12_desc:  { tr: "Kayseray takip", en: "Kayseray tracker", ja: "" },
  project_12_meta:  { tr: "proje203.com", en: "proje203.com", ja: "" },
  project_13_desc:  { tr: "Historical Card Game", en: "Historical Card Game", ja: "" },
  project_13_meta:  { tr: "proje203.com", en: "proje203.com", ja: "" },
  project_14_desc:  { tr: "\"Good Chat\"", en: "\"Good Chat\"", ja: "" },
  project_14_meta:  { tr: "proje203.com", en: "proje203.com", ja: "" },
  project_15_desc:  { tr: "KargaManga Card Game", en: "KargaManga Card Game", ja: "" },
  project_15_meta:  { tr: "proje203.com", en: "proje203.com", ja: "" },
  project_16_desc:  { tr: "Damn! A lot", en: "Damn! A lot", ja: "" },
  project_16_meta:  { tr: "proje203.com", en: "proje203.com", ja: "" },

  // --- Yazilar bolumu ---
  articles_title:   { tr: "Yazılar", en: "Writing", ja: "" },
  articles_more:    { tr: "Diğer Yazılar", en: "More writing", ja: "" },
  // Yazilarin BASLIKLARI cevrilmiyor: baglanti hedefi tek dilde yayinlandi,
  // basligi cevirmek okuyucuyu anlamadigi bir metne goturur. Ozgun baslik kalir.
  article_1_title:  { tr: "大好きな図書館:IPA", en: "大好きな図書館:IPA", ja: "" },
  article_2_title:  { tr: "Japon Modernleşmesine Farklı Bir Bakış", en: "Japon Modernleşmesine Farklı Bir Bakış", ja: "" },
  article_3_title:  { tr: "Speaking Club Ideas", en: "Speaking Club Ideas", ja: "Speaking Club Ideas" },
};
