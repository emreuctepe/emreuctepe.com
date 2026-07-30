"use strict";

// TEK CEVIRI DOSYASI - her satir bir metin, diller yan yana sutunlar halinde.
//
// Ceviri eklemek/duzeltmek icin SADECE bu dosyayi duzenle. Yeni bir dil eklemek
// icin her satira yeni bir sutun ekle (ornegin de: "...") ve js/i18n.js icindeki
// SUPPORTED listesine dil kodunu yaz - baska hicbir yere dokunmaya gerek yok.
//
// Bos string ("") = "henuz cevrilmedi" demek. O durumda i18n.js metne hic
// dokunmaz, index.html'in govdesindeki Turkce metin oldugu gibi kalir. Yani
// eksik ceviri siteyi bozmaz, sadece Turkce gorunur. Ozel isimler (Dettol,
// proje203.com, kisi/rol adlari) icin de bos birakmak dogru davranistir.
//
// tr sutunu index.html'deki metnin kopyasidir; ikisini birlikte guncelle
// (HTML'deki metin JS kapaliyken/yuklenmeden once gorunen metindir).
window.STRINGS = {
  // --- Sayfa meta bilgileri (<title>, description, og:*) ---
  page_title:       { tr: "Emre Üçtepe",                                en: "", ja: "ヱムレ・ウチュテペ" },
  page_desc:        { tr: "Emre Üçtepe'nin kişisel sitesi — projeler, yazılar ve iletişim.", en: "", ja: "" },

  // --- Erisilebilirlik metinleri (aria-label) ---
  profile_alt:      { tr: "Emre Üçtepe profil fotoğrafı",               en: "", ja: "" },
  email_label:      { tr: "E-posta gönder",                             en: "", ja: "" },

  // --- Baslik alani ---
  name:             { tr: "Emre Üçtepe",                                en: "", ja: "ヱムレ・ウチュテペ" },
  country:          { tr: "Türkiye",                                    en: "", ja: "トルコ" },

  // --- Hakkimda ---
  about_title:      { tr: "Hakkımda",                                   en: "", ja: "" },
  about_text:       { tr: "Selam, şu an Japon Dili ve Edebiyatı(Erü) okuyorum. Kendi halimde oyunculuğa devam ediyorum. Sıkıldığımda da matematik, geometri, oyun programlama ve web uygulamaları gibi alanlarda takılıyorum.", en: "", ja: "" },
  about_more:       { tr: "İletişime Geç",                              en: "", ja: "" },

  // --- Projeler bolumu ---
  work_title:       { tr: "Projeler",                                   en: "", ja: "" },
  work_more:        { tr: "Diğer Projeler",                             en: "", ja: "" },
  work_past:        { tr: "--------------Geçmiş----------",             en: "----------Past----------", ja: "----------過去----------" },

  // Her projenin iki parcasi var: _desc = baslik, _meta = tireden sonraki aciklama.
  project_1_desc:   { tr: "Aylık Sosyal Dergi",                         en: "", ja: "毎月雑誌" },
  project_1_meta:   { tr: "dergi.com",                                  en: "", ja: "" },
  project_2_desc:   { tr: "Türkiye'yi tanıtmak bana mı kaldı kardeşim!", en: "", ja: "" },
  project_2_meta:   { tr: "YouTube Podcast",                            en: "", ja: "ポッドカスと" },
  project_3_desc:   { tr: "Rastgele Konu Seç",                          en: "", ja: "" },
  project_3_meta:   { tr: "randomtopik.com",                            en: "", ja: "" },
  project_6_desc:   { tr: "Osman",                                      en: "", ja: "" },
  project_6_meta:   { tr: "Diriliş: Ertuğrul Dizi",                     en: "", ja: "" },
  project_7_desc:   { tr: "Naci",                                       en: "", ja: "" },
  project_7_meta:   { tr: "Başarmalısın film",                          en: "", ja: "映画" },
  project_8_desc:   { tr: "Hakan",                                      en: "", ja: "" },
  project_8_meta:   { tr: "Hayat Dediğin: Sevginin Gücü",               en: "", ja: "映画" },
  project_10_desc:  { tr: "Türk Hava Yolları",                          en: "", ja: "" },
  project_10_meta:  { tr: "Reklam Filmi",                               en: "", ja: "" },
  project_11_desc:  { tr: "Dettol",                                     en: "", ja: "" },
  project_11_meta:  { tr: "Reklam Filmi (Şu an BOYKOT!)",               en: "", ja: "" },

  // Asagidakiler index.html'de su an yorum icinde - yorumu kaldirinca aktif olur.
  project_4_desc:   { tr: "Project G",                                  en: "", ja: "" },
  project_4_meta:   { tr: "İnteraktif Geometri Öğrenme platformu",      en: "", ja: "" },
  project_5_desc:   { tr: "benkyoutorukogo.com",                        en: "", ja: "" },
  project_5_meta:   { tr: "Japonlar için Türkçe Öğrenme Materyalleri",  en: "", ja: "" },
  project_12_desc:  { tr: "Kayseray takip",                             en: "", ja: "" },
  project_12_meta:  { tr: "proje203.com",                               en: "", ja: "" },
  project_13_desc:  { tr: "Historical Card Game",                       en: "", ja: "" },
  project_13_meta:  { tr: "proje203.com",                               en: "", ja: "" },
  project_14_desc:  { tr: "\"Good Chat\"",                              en: "", ja: "" },
  project_14_meta:  { tr: "proje203.com",                               en: "", ja: "" },
  project_15_desc:  { tr: "KargaManga Card Game",                       en: "", ja: "" },
  project_15_meta:  { tr: "proje203.com",                               en: "", ja: "" },
  project_16_desc:  { tr: "Damn! A lot",                                en: "", ja: "" },
  project_16_meta:  { tr: "proje203.com",                               en: "", ja: "" },

  // --- Yazilar bolumu ---
  articles_title:   { tr: "Yazılar",                                    en: "", ja: "" },
  articles_more:    { tr: "Diğer Yazılar",                              en: "", ja: "" },
  // Yazilarin kendisi tek dilde yayinlandi; baslik cevirisi istege bagli.
  article_1_title:  { tr: "大好きな図書館:IPA",                          en: "", ja: "" },
  article_2_title:  { tr: "Japon Modernleşmesine Farklı Bir Bakış",     en: "", ja: "" },
  article_3_title:  { tr: "A Thrilled Love Story In The Old Train with Grapphities", en: "", ja: "" },
};
