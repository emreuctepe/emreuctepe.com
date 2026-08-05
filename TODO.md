# Yapılacaklar

Son güncelleme: 2026-07-30. Analiz sonucu çıkarıldı; iş bitince satırı sil.

---

## 1. Yayın

Site şu an **hiçbir yerde yayında değil.** `emreuctepe.com` bir domain park
sayfası servis ediyor (114 byte, `/lander`'a yönlendiriyor; IP 15.197.148.33 /
3.33.130.190). Her yol 200 dönüyor, hepsi aynı park sayfası.
`emreuctepe.github.io` de 404 — GitHub Pages açık değil.

- [ ] Hosting'i kur ve DNS'i oraya yönlendir
- [ ] Yayına almadan önce `robots.txt` ekle (repoda yok; şu an canlıda görünen park sayfasının kendi dosyası)
- [ ] `sitemap.xml` ekle — `/` ve `/en/` (`/ja/` üretilince o da)
- [ ] `python3 build.py` çıktısını (`en/`) commit'lemeyi unutma; CI yok, repoda yoksa yayında da yok

---

## 2. Eksik linkler — aktif listede

Her biri `href="#"`. Tıklanınca `target="_blank"` yüzünden **boş sekme açıyor**.

Bunlar öncelikle bir **UX** sorunu, SEO değil: Google için `href="#"` kırık link
sayılmaz, sayfa içi çapadır — 404 üretmez, crawl hatası vermez. Zarar, tıklayan
kullanıcının boş sekmeyle karşılaşması.

- [ ] [index.html:74](index.html:74) — **Aylık Sosyal Dergi** (dergi.com): URL yok. `dergi.com` başkasına ait, gerçek adres gerekiyor
- [ ] [index.html:75](index.html:75) — **Türkiye'yi tanıtmak bana mı kaldı kardeşim!** (YouTube Podcast): YouTube playlist/video linki ekle — kanal `@emreuctepee`
- [x] [index.html:76](index.html:76) — **Rastgele Konu Seç**: `emreuctepe.github.io/random-topik/` adresine bağlandı (randomtopik.com domaini çözülmüyordu)
- [ ] [index.html:81](index.html:81) — **Türk Hava Yolları** (Reklam Filmi): YouTube linki ekle
- [ ] [index.html:82](index.html:82) — **Dettol** (Reklam Filmi): YouTube linki ekle
- [x] [index.html:100](index.html:100) — Yazı **Speaking Club Ideas** olarak değiştirildi ve Medium'a bağlandı

Bu satırlar `lang/strings.js`'te de var — URL eklerken metni değiştirirsen
tablonun `tr` **ve** `en` sütunlarını birlikte güncelle.

## 3. Link olmayan `<a>`'lar

- [ ] [index.html:93](index.html:93) — **"Diğer Projeler" butonu**: JS ile listeyi açıyor ama `href="#"` + `target="_blank"`. JS yüklenmeden tıklanırsa boş sekme açar. `<button>` olmalı; en azından `target="_blank"` kalkmalı
- [ ] [index.html:77](index.html:77) — **"Geçmiş" ayırıcısı**: `href`'siz `<a target="_blank" rel="noopener">`. Link değil, ayıraç; `<li><span>` olmalı
- [ ] [index.html:58](index.html:58) — **Dil değiştirici**: kök sayfada `href="#"`, seçim JS ile yapılıyor. Arama motoru diğer dilleri buradan takip edemiyor. `href="/en/"` / `href="/ja/"` yapılırsa JS kapalıyken de çalışır (build.py üretilen sayfalarda bunu zaten yapıyor)

## 4. Eksik linkler — yorumdaki pasif satırlar

[index.html:84-90](index.html:84) arasındaki 7 satır yorum içinde, hepsi `href="#"`.
Aktifleştirmeden önce URL gerekiyor.

**SEO etkisi yok.** Arama motorları HTML'i parse ederken comment node'larını atar:
o satırlar indekslenecek içerik sayılmaz, link grafiğine girmez, crawl isteği
doğurmaz. ("Yorumdaki gizli metin" eski bir SEO efsanesi; Google uzun süredir
tamamen yok sayıyor.) Geriye iki gerçek maliyet kalıyor:

1. **Kaynak görüntüleme** — "view source" diyen herkes yayınlanmamış proje
   adlarını görüyor. İfşa meselesi, SEO değil.
2. **Coverage paydası** — aşağıdaki maddeye bak; asıl pratik sorun bu.

- [ ] Project G, Kayseray takip, Historical Card Game, "Good Chat", KargaManga Card Game, benkyoutorukogo.com, Damn! A lot
- [ ] `proje203.com` (5 satırda geçiyor) ve `benkyoutorukogo.com` **DNS'te çözülmüyor** — bu siteler yayında değil

### Coverage paydası görünmeyen satırları da sayıyor

`build.py`'nin `coverage()` fonksiyonu tablodaki **tüm** key'leri sayıyor, ama
14 key yorum içindeki (yani hiç görünmeyen) satırlara ait:

| | key sayısı |
| --- | --- |
| tabloda toplam | 47 |
| yorum içinde kalan | 14 |
| gerçekten görünen | **33** |

Sonuç: Japoncanın %90 eşiğini geçmesi için 43 key çevirmen gerekiyor — bunun 14'ü
kimsenin göremeyeceği satırlar. Sadece görünenler sayılsa 30 yeterdi.
Şu anki JA durumu: **11/47 = %23**, ama sadece görünenlerde **11/33 = %33**.

- [ ] `coverage()` yalnızca `index.html`'de (yorum dışında) gerçekten kullanılan key'leri saysın

---

## 5. Çeviri

- [x] İngilizce tamamlandı (47/47), `en/index.html` üretiliyor
- [ ] `lang/strings.js`'te `GOZDEN GECIR` işaretli iki satırı onayla:
  - `about_text` — kişisel biyografi, ton sana ait. "(Erü)" → "Erciyes University" olarak açıldı
  - `project_2_desc` — deyimsel ifade, birebir çevrilmiyor
- [ ] **Japonca %23 (11/47)** — `/ja/` üretilmiyor. Tabloyu doldur
- [ ] JA %90'a ulaşana kadar [index.html:17](index.html:17) `hreflang="ja"` satırını kaldır — şu an var olmayan bir sayfayı arama motoruna duyuruyor

### Tüm dil hatalarını gözden geçir

`lang/strings.js` üç dili birden tutuyor ve tablo elle dolduruldukça yazım
hataları birikiyor. Tek seferde baştan sona oku, üç sütunu da revize et.

- [ ] **Japoncayı baştan sona revize et.** Bilinen adaylar:
  - `project_2_meta` = `ポットキャスト` → standart yazım **`ポッドキャスト`** (`ポット` = "pot")
  - `project_3_desc` = `ランドムトピックを選ぶ` → "random" standart yazımı **`ランダム`**
  - `page_title` / `name` = `ヱムレ・ウチュテペ` — `ヱ` arkaik "we" kanası; stilistik tercihse kalsın, değilse `エムレ`
  - `project_1_desc` = `毎月雑誌` → "aylık dergi" için `月刊誌` daha yerleşik
- [ ] **Türkçe ve İngilizce sütunları da oku** — özellikle `GOZDEN GECIR` işaretli iki satır ve elle eklenen yeni metinler

### index.html ile tablonun `tr` sütunu ayrışmış

README kuralı: Türkçe metin iki yerde duruyor, ikisi birlikte güncellenmeli.
Şu an bir satır ayrışmış durumda:

| key | index.html | strings.js `tr` |
| --- | --- | --- |
| `project_6_meta` | `Diriliş: Ertuğrul Dizi` | `Diriliş: Ertuğrul Dizi S5/B1-B29` |

Sonuç: kök sayfa (JS yüklenene kadar) kısa metni, `/en/` ve dil değişimi sonrası
uzun metni gösteriyor.

- [ ] Hangisi doğruysa ikisini eşitle

---

## 6. Doğrulanmış hatalar

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

## 7. Diğer

- [ ] `og:image` yok — sosyal paylaşımda önizleme görseli çıkmıyor. `images/avatar-240.webp` kullanılabilir (OG için 1200×630 daha uygun)
- [ ] `index.html:113` ve `js/color.js:4`'teki tinycolor notları tarihî açıklama; dosya silindi, notlar kalabilir
- [ ] yorum satırlarını kaldır. detaylı manuel hazırla.

---

## Yapıldı

- [x] Bekleyen 6 commit'lik iş `main`'e alındı ve push edildi
- [x] `js/tinycolor.js` silindi (1170 satır ölü kod, hiçbir yerden yüklenmiyordu)
- [x] Statik sayfadan köke dönünce dilin takılı kalması düzeltildi ([js/i18n.js](js/i18n.js))
- [x] `.gitignore` eklendi (`__pycache__/`)
