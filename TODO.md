# Yapılacaklar

Son güncelleme: 2026-08-05. Analiz sonucu çıkarıldı; iş bitince satırı sil.

---

## 1. Yayın

Site şu an **hiçbir yerde yayında değil.** `emreuctepe.com` bir domain park
sayfası servis ediyor (114 byte, `/lander`'a yönlendiriyor; IP 15.197.148.33 /
3.33.130.190). Her yol 200 dönüyor, hepsi aynı park sayfası.
`emreuctepe.github.io` de 404 — GitHub Pages açık değil.

- [ ] Hosting'i kur ve DNS'i oraya yönlendir
- [ ] **Hosting seçilince gizlilik sayfalarını güncelle** — aşağıya bak
- [ ] Yayına almadan önce `robots.txt` ekle (repoda yok; şu an canlıda görünen park sayfasının kendi dosyası)
- [ ] `sitemap.xml` ekle — `/`, `/en/`, `/ja/` ve üç `privacy.html`
- [ ] `python3 build.py` çıktısını (`en/`, `ja/`) commit'lemeyi unutma; CI yok, repoda yoksa yayında da yok

### Hosting seçilince gizlilik metninde değişmesi gerekenler

Gizlilik sayfalarında barındırma sağlayıcısı şu an **kategori olarak** anılıyor
("Barındırma hizmeti sağlayıcısı"), adıyla değil. Hukuken bu geçerli — GDPR
m.13/1-e alıcı *kategorisi* belirtmeyi yeterli sayıyor — ama sağlayıcı belli
olunca adını yazmak doğru olan.

Değiştirilecek satırlar (üçü de aynı listenin içinde, GoatCounter maddesinden
hemen sonra; yerini işaretleyen bir HTML yorumu var):

| Dosya | Satır |
| --- | --- |
| [privacy.html](privacy.html:89) | 89 |
| [en/privacy.html](en/privacy.html:94) | 94 |
| [ja/privacy.html](ja/privacy.html:89) | 89 |

- [ ] Sağlayıcının **adını** yaz
- [ ] Sunucuların **hangi ülkede** olduğunu yaz
- [ ] Türkiye dışındaysa o maddeye de **KVKK m.9 yurt dışı aktarım** cümlesini
      ekle — GoatCounter maddesinde yazan cümlenin aynısı (Kurul'un yeterlilik
      kararı bulunmadığı notu dahil)
- [ ] Sağlayıcı sunucu loglarına erişim vermiyorsa (ör. GitHub Pages) "saklama
      süresi" bölümündeki *"birkaç hafta"* tahminini gerçek durumla değiştir:
      logları sen görmüyorsan bunu açıkça yaz
- [ ] Bu üç dosya `build.py` ile üretilmiyor, elle yazılıyor — üçünü **birlikte**
      güncelle (bkz. README)

---

## 2. Eksik linkler — aktif listede

Her biri `href="#"`. Tıklanınca `target="_blank"` yüzünden **boş sekme açıyor**.

Bunlar öncelikle bir **UX** sorunu, SEO değil: Google için `href="#"` kırık link
sayılmaz, sayfa içi çapadır — 404 üretmez, crawl hatası vermez. Zarar, tıklayan
kullanıcının boş sekmeyle karşılaşması.

- [ ] [index.html:85](index.html:85) — **Aylık Sosyal Dergi** (dergi.com): URL yok. `dergi.com` başkasına ait, gerçek adres gerekiyor
- [ ] [index.html:86](index.html:86) — **Sadece Japonca Pratik** (YouTube Podcast): YouTube playlist/video linki ekle — kanal `@emreuctepee`
- [x] [index.html:87](index.html:87) — **Rastgele Konu Seç**: `emreuctepe.github.io/random-topik/` adresine bağlandı (randomtopik.com domaini çözülmüyordu)
- [ ] [index.html:92](index.html:92) — **Türk Hava Yolları** (Reklam Filmi): YouTube linki ekle
- [ ] [index.html:93](index.html:93) — **Dettol** (Reklam Filmi): YouTube linki ekle
- [x] [index.html:103](index.html:103) — Yazı **Speaking Club Ideas** olarak değiştirildi ve Medium'a bağlandı

Bu satırlar `lang/strings.js`'te de var — URL eklerken metni değiştirirsen
tablonun `tr` **ve** `en` sütunlarını birlikte güncelle.

## 3. Link olmayan `<a>`'lar

- [ ] [index.html:96](index.html:96) — **"Diğer Projeler" butonu**: JS ile listeyi açıyor ama `href="#"` + `target="_blank"`. JS yüklenmeden tıklanırsa boş sekme açar. `<button>` olmalı; en azından `target="_blank"` kalkmalı
- [ ] [index.html:88](index.html:88) — **"Geçmiş" ayırıcısı**: `href`'siz `<a target="_blank" rel="noopener">`. Link değil, ayıraç; `<li><span>` olmalı
- [ ] [index.html:62](index.html:62) — **Dil değiştirici**: kök sayfada `href="#"`, seçim JS ile yapılıyor. Arama motoru diğer dilleri buradan takip edemiyor. `href="/en/"` / `href="/ja/"` yapılırsa JS kapalıyken de çalışır (build.py üretilen sayfalarda bunu zaten yapıyor)

## 4. Çeviri

Tablo şu an **34 key, üç dilde de %100** — `en/` ve `ja/` sorunsuz üretiliyor.
Kalan iş çeviri eksiği değil, kalite gözden geçirmesi.

- [ ] `lang/strings.js`'te `GOZDEN GECIR` işaretli iki satırı onayla:
  - `about_text` — kişisel biyografi, ton sana ait. "(Erü)" → "Erciyes University" olarak açıldı
  - `project_2_desc` — deyimsel ifade, birebir çevrilmiyor

### Tüm dil hatalarını gözden geçir

`lang/strings.js` üç dili birden tutuyor ve tablo elle dolduruldukça yazım
hataları birikiyor. Tek seferde baştan sona oku, üç sütunu da revize et.

- [ ] **Japoncayı baştan sona revize et.** Bilinen adaylar:
  - `project_2_meta` = `ポットキャスト` → standart yazım **`ポッドキャスト`** (`ポット` = "pot")
  - `project_3_desc` = `ランドムトピックを選ぶ` → "random" standart yazımı **`ランダム`**
  - `page_title` / `name` = `ヱムレ・ウチュテペ` — `ヱ` arkaik "we" kanası; stilistik tercihse kalsın, değilse `エムレ`
  - `project_1_desc` = `毎月雑誌` → "aylık dergi" için `月刊誌` daha yerleşik
- [ ] **Türkçe ve İngilizce sütunları da oku** — özellikle `GOZDEN GECIR` işaretli iki satır ve elle eklenen yeni metinler

---

## 5. Doğrulanmış hatalar

### Liste açılınca header 117px aşağı sıçrıyor

[js/mv.js:642](js/mv.js:642). Ölçüldü (941×660 viewport, intro bitmiş, scrollY 0):

| | değer |
| --- | --- |
| header doğal konumu | 84px |
| hesaplanan sticky `top` | 195px = (660 − 270) / 2 |
| açılıştan sonra | 201px |
| **sıçrama** | **117px** |

Sebep: `top` header'ı *viewport'ta* ortalıyor (195px), ama header'ın doğal akış
konumu 84px. `position: sticky` + `top` bir **alt sınır** olduğu için, doğal
konum `top`'un üstünde kaldığında eleman aşağı itiliyor. Sayfa o an
kaydırılabilir bile değil (`scrollHeight <= innerHeight`), yani sticky hiçbir
fayda sağlamadan header'ı yerinden oynatıyor.

Kodun kendi yorumu bunun tersini söylüyor: *"header KIMILDAMAZ"*
([js/mv.js:595](js/mv.js:595)). Satırlar eklenirken kımıldamıyor — ama açılış
anında 117px kayıyor.

Not: `a4f837b` commit'indeki okuma-sırası düzeltmesi bu sıçramayı **büyüttü**.
Öncesinde `offsetHeight` gerilmiş grid satırını (470) okuyordu →
`top` = (660−470)/2 = 95, doğal konuma yakın. Doğru ölçüm gizli uyumsuzluğu
açığa çıkardı.

- [ ] Karar ver: header açılışta yerinde mi kalsın (`top` = doğal konum), yoksa viewport'ta ortalanması kasıtlı mı?

### Dokunma hedefleri hedeflenen boyuta ulaşmıyor

[css/index.css](css/index.css) `@media (pointer: coarse)` bloğu çalışıyor ama
yorumda yazan ~44px'e (Apple HIG) ulaşmıyor. Ölçüm (kural elle uygulanarak):

| öğe | önce | sonra | hedef |
| --- | --- | --- | --- |
| proje/yazı linkleri | 21.8px | **30.4px** | 44px |
| "Diğer Projeler" | 19px | 41.8px | 44px |
| dil seçici | 14.7×17.1px | **29.9×38px** | 44px |

`padding: 4px 0` bir satırı 21.8 → 29.8px yapıyor; 44px için ~11px padding
gerekir.

- [ ] Padding'i hedefe göre büyüt ya da yorumdaki "~44px" iddiasını gerçek değerle değiştir

---

## 6. Diğer

- [ ] `og:image` yok — sosyal paylaşımda önizleme görseli çıkmıyor. `images/avatar-240.webp` kullanılabilir (OG için 1200×630 daha uygun)
- [ ] [index.html:116](index.html:116) ve [js/color.js:4](js/color.js:4)'teki tinycolor notları tarihî açıklama; dosya silindi, notlar kalabilir
- [ ] yorum satırlarını kaldır. detaylı manuel hazırla.

---

## Yapıldı

- [x] **Gizlilik sayfaları** üç dilde eklendi ([privacy.html](privacy.html),
      [en/privacy.html](en/privacy.html), [ja/privacy.html](ja/privacy.html)) —
      elle yazılıyor, `build.py` üretmiyor. Düzeni [css/page.css](css/page.css)
- [x] **Çerezsiz sayaç** eklendi (GoatCounter, `emreuctepe.goatcounter.com`).
      Cihaza hiçbir şey yazmadığı için çerez banner'ı gerekmiyor
- [x] **Google Fonts self-host'a alındı** ([css/fonts.css](css/fonts.css) +
      `fonts/`) — artık ziyaretçi IP'si Google'a gitmiyor. Tarayıcıda doğrulandı:
      dış istek yalnızca `gc.zgo.at/count.js`
- [x] Japonca tamamlandı (34/34), `ja/index.html` üretiliyor — `hreflang="ja"`
      artık var olan bir sayfayı gösteriyor, kaldırma ihtiyacı kalmadı
- [x] İngilizce tamamlandı (34/34), `en/index.html` üretiliyor
- [x] `strings.js`'teki yorum içinde kalmış 14 key silindi — `coverage()`
      paydası artık yalnızca gerçekten görünen satırları sayıyor
- [x] `project_6_meta` index.html ile `strings.js` arasında eşitlendi
- [x] Bekleyen 6 commit'lik iş `main`'e alındı ve push edildi
- [x] `js/tinycolor.js` silindi (1170 satır ölü kod, hiçbir yerden yüklenmiyordu)
- [x] Statik sayfadan köke dönünce dilin takılı kalması düzeltildi ([js/i18n.js](js/i18n.js))
- [x] `.gitignore` eklendi (`__pycache__/`)
