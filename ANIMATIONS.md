# emreuctepe.com — Animasyon Dökümantasyonu

Bu dosya, sitedeki tüm animasyonların ne olduğunu, hangi dosyada/fonksiyonda
tanımlandığını, teknik olarak nasıl çalıştığını, zamanlama parametrelerini ve
tetikleyicilerini betimler. Estetik bütün olarak amaç: **"sinyal bozulması / VHS
glitch"** — koyu zemin üzerinde rastgele neon renklerin (`hsl(h, 80%, 65%)`) kısa,
sinirli, bozulmalı hareketlerle belirmesi.

## Dinlenme (idle) görünümü — site açıldıktan sonra

Açılış sekansı (bkz. §1) bittiğinde `#intro` katmanı DOM'dan silinir ve site sakin,
**neredeyse durağan** haline yerleşir. O andaki görünüm şöyledir:

- **Zemin:** neredeyse siyah, hafif mavi-gri `#101214`. İçerik ekranda hem **dikey
  hem yatay ortalı** (flex center), `max-width ~1000px`.
- **Yerleşim (masaüstü):** iki sütunlu grid (`2fr / 3fr`, aralarında ~5vw boşluk).
  - **Sol sütun — kimlik (ortalanmış):** üstte 120px **dairesel profil avatarı**
    (canlı ama sakin biçimde titreşen glitch — bkz. §2), altında beyaz `Emre Üçtepe`
    başlığı, gri `Türkiye` satırı, ince gri SVG **iletişim ikonları** dizisi
    (e-posta · GitHub · Medium · YouTube) ve en altta küçük **dil değiştirici**
    `TR · EN · 日本語` (aktif dil beyaz, altında ince neon çizgi).
  - **Sağ sütun — içerik:** dikey ortalı üç bölüm — **Hakkımda**, **Projeler**,
    **Yazılar**. Başlıklar beyaz ve ince (normal ağırlık), gövde metni sessiz gri
    `#8E9094`, liste ve linkler daha açık gri; her bölümün altında küçük bir
    ok'lu "eylem" linki (`İletişime Geç`, `Diğer Projeler`, `Diğer Yazılar`).
- **Yerleşim (≤800px):** sütunlar tek kolona iner; kimlik üstte, içerik altta yığılır.
- **Renk hissi:** genel olarak **koyu + gri, çok sakin**; tek canlı vurgu, o
  yüklemede rastgele seçilmiş **neon inline-link rengi** (`--inline-link-color`) ve
  aynı renkteki **daire favicon**'dur (bkz. §5).
- **İmleç:** linkler dışında her yerde `default` ok; sadece `<a>` öğelerinde
  `pointer`. Metin seçilebilir durumdadır.

Bu durağan görünümde **tek sürekli hareket profil avatarının glitch'idir** (arada bir
~15–20 sn temiz duruma geçer). Bunun dışında sayfa, her `tour + 15sn` periyodunda
kısa süreliğine canlanır: **otomatik link tanıtım turu** (bkz. §4) linkleri sırayla
neon renklere yakıp söndürür, sonra site yine sessizliğine döner. Kullanıcı bir linkin
üzerine gelirse o link parçalanma efektiyle titremeye başlar (bkz. §3). Yani idle hali:
**karanlık, minimal, sessiz bir editoryal düzen** — üzerinde ara ara beliren neon
kıvılcımlar.

## 0. Ortak altyapı

- **Animasyon motoru:** [`js/dynamics.js`](js/dynamics.js) — yay/fizik tabanlı
  (spring) bir kütüphane (CoffeeScript üretimi). `dynamics.animate(el, hedef, opts)`,
  `dynamics.css(el, props)`, `dynamics.setTimeout(fn, ms)` ve `easeInOut/easeOut`
  eğrilerini sağlar. **Önemli:** `dynamics.setTimeout` ve animasyonlar sekme
  görünmez olunca (`visibilitychange`) otomatik **durur** — arka planda pil yakmaz.
- **Rastgele neon renk:** [`js/color.js`](js/color.js) → `window.randomVividColor()`
  = `hsl(rastgele 0–359, 80%, 65%)`. Tüm renkli animasyonların ortak kaynağı.
- **Hareket azaltma:** `prefers-reduced-motion: reduce` açıksa ağır animasyonlar
  (intro, glitch, otomatik tur) tamamen atlanır veya statik hale gelir.
- **Zemin/renk paleti:** zemin `#101214`, gövde `#8E9094`, başlık beyaz, vurgular neon.

---

## 1. Açılış (intro) sekansı

**Dosya:** [`js/mv.js`](js/mv.js) — en üstteki `intro` IIFE (~satır 305–404) +
`_animateStripes`, `showContent`, içerik klonlama IIFE (~satır 224).
**Tetikleyici:** sayfa yüklenince bir kez.
**Hareket azaltma:** açıksa tüm sekans atlanır; içerik anında gösterilir, klonlar ve
intro katmanı kaldırılır ([mv.js:308](js/mv.js)).

Tam ekran `#intro` katmanı (`#stripes` SVG + `#logo-container`) üzerinde oynar.
Zaman çizelgesi (0 = yükleme anı, `dynamics.setTimeout` ile):

| t (ms) | Olay |
|---|---|
| 0 | 200 siyah + 100 renkli şerit belirir (1. dalga). Sayfa `scale 0.95→1` (4000ms, easeInOut). Logo `scale 1→0.90` (1500ms, easeOut) + `animateLogo()` sarsıntısı. |
| 1 | Logo görünür olur. |
| 1000 | `animateLogo()` tekrar + 2. şerit dalgası (200 siyah `delayShow`, 100 renkli). |
| 1300 | Intro arka planı şeffaflaşır; logo rastgele bir konuma "fırlatılır" (`scale 1`, ekran boyunca rastgele translate); `showContent()` başlar. |
| 1350 | Logo `scale 0.75`. |
| 1400 | Logo `display:none`. |
| 3000 | `#intro` katmanı DOM'dan silinir. |

### 1a. Şerit (stripe) süpürmesi — `_animateStripes`
[mv.js:35](js/mv.js). `#stripes` SVG'sine `count` adet `<rect>` şerit ekler.
- **Renkli şeritler** (`animateColoredStripes`, [mv.js:121](js/mv.js)): renk
  `randomVividColor()`; görün gecikmesi `random*300ms`.
- **Siyah şeritler** (`animateBlackStripes`, [mv.js:98](js/mv.js)): renk `#101214`,
  `sizeRatio 3` (daha kalın); zeminle aynı renk oldukları için içeriği "örten/açan"
  maske gibi davranır.
- Her şerit: rastgele konum/boyut → `display:none`→`block` (show gecikmesi) →
  dönüşüm: `width/2`, `height/5` + `x`/`y` sarsıntısı (transform gecikmesi) → 100ms
  sonra DOM'dan silinir. Sonuç: ekranı yatay çizgilerle "tarayan" bir bozulma.

### 1b. Logo sarsıntısı — `animateLogo`
[mv.js:343](js/mv.js). `scale 0.5` + `translateX ±50` → 100ms'de `translateX 10 /
scale 0.55` → 150ms'de `translateX 0 / scale 0.5`. Kısa, ani bir "glitch titremesi".

### 1c. İçeriğin şerit maskeleriyle belirmesi — `showContent`
[mv.js:248](js/mv.js) + içerik klonlama IIFE [mv.js:224](js/mv.js).
1. Yükleme anında `#header-content` ve `#content` her biri **6 kez klonlanır**
   (`cloneAndStripeElement`, [mv.js:187](js/mv.js)); orijinaller gizlenir
   (`visibility:hidden`).
2. Her klon, `createMasksWithStripes(6, ...)` ([mv.js:141](js/mv.js)) ile üretilen bir
   **yatay şerit clip-path maskesine** kırpılır → her klon içeriğin yalnızca belli
   yatay bantlarını gösterir. Klonlara `1px` rastgele neon **kenarlık**, iç öğelere
   (`h2, li>a, a.more, h1, p, path`) rastgele neon renk verilir.
3. `showContent`: her klon rastgele `d = 50–400ms` gecikmeyle görünür; `translateX`
   sarsıntısı (`±20`) → `d+100`'de `/-5` → `d+150`'de `0` (ve "more" olmayan klon
   silinir). `data-idx<=3` olan klonlar `d+300` ekstra sarsıntı + `d+550` silinir.
4. Tüm gecikmeler bitince orijinal içerik `visibility:visible` olur.
Sonuç: metin, kenarları renkli yatay bantlar halinde **parçalı biçimde "toplanarak"**
belirir (glitch assemble).

---

## 2. Profil "glitch" avatarı

**Dosya:** [`js/profile-glitch.js`](js/profile-glitch.js).
**Tetikleyici:** sürekli (canvas döngüsü), avatar görünürken.
**Öğe:** `#profile-glitch-canvas` içine eklenen 120×120 `<canvas>`.

`avatar-240.webp` (yoksa `IMG_6924.jpeg`) 120px'e ölçeklenip **pristine** piksel
kopyası alınır. Her karede taze kopyadan başlanıp şu efektler zincirlenir:

| Efekt | Fonksiyon | Ne yapar | Olasılık/param |
|---|---|---|---|
| **Tarama çizgisi** | `flowLine` | Aşağı kayan tek bir yatay satırı parlatır (piksel değerine `randX 24–80` ekler); satır her kare `speed 4–24` iner | her kare |
| **Satır kaydırma** | `shiftLine` (×6) | Rastgele bir y-aralığını yatayda `±40px` kaydırır | her slot %50 |
| **RGB kayması** | `shiftRGB` (×1) | R/G/B kanallarını birbirinden `±16px` x/y ayırır → kromatik sapma | %35 (rand>65) |
| **Parça saçılması** | `getRandomRect`+scatter (×3) | Rastgele bir dikdörtgen parçayı (30..w × 1..50) rastgele bir konuma yeniden çizer | her parça %20 (rand>80) |
| **Temiz geçiş** | `throughFlag` | Ara sıra efektleri durdurup **temiz** görüntüyü `15000–20000ms` gösterir | rand>75 iken tetiklenir ([profile-glitch.js:160](js/profile-glitch.js)) |

**Performans/erişilebilirlik:**
- ~**20 fps**'e sınırlı (`FRAME_MS = 1000/20`, [profile-glitch.js:212](js/profile-glitch.js)).
- Canvas görünmezken **IntersectionObserver** ile, sekme gizliyken
  **visibilitychange** ile döngü durur.
- `prefers-reduced-motion` açıksa hiç döngü yok — tek **statik** kare çizilir.

---

## 3. Hover'da link parçalanması (shatter)

**Dosya:** [`js/mv.js`](js/mv.js) — `handleMouseOver` / `animateLink` (~satır 411–495).
**Tetikleyici:** herhangi bir `<a>` üzerine gelince (`mouseover`); `mouseout`'ta durur.
**Koşul:** yalnızca dokunmatik olmayan cihazlarda (`!('ontouchstart' in window)`).

Hover süresince **sürekli tekrar eden** bir döngü:
1. `createMasksWithStripes(3, box, 3)` ile 3 ince yatay şerit maskesi üretilir.
2. Link 3 kez klonlanıp her klon bir maskeye kırpılır, her biri rastgele neon renge boyanır.
3. Klonlar `translateX ±5` sarsılır → 50ms'de `0` → 100ms'de `±2.5` → 150ms'de silinir.
4. `random*1000ms` sonra `animate()` yeniden çağrılır (hover sürdükçe), maske tanımları temizlenir.

Sonuç: üzerine gelinen link, renkli yatay dilimlere **parçalanıp titreyen** canlı bir
glitch efekti verir. `isHoverAnimating` bayrağı bu sırada otomatik turu bastırır.

---

## 4. Otomatik link tanıtım turu

**Dosya:** [`js/mv.js`](js/mv.js) — `demoAllLinksOnce` (~satır 509–542).
**Tetikleyici:** yüklemeden **2800ms** sonra bir kez, ardından periyodik.
**Hareket azaltma:** açıksa hiç çalışmaz.

Amaç: hangi öğelerin tıklanabilir olduğunu sezdirmek. Sayfadaki **canlı** linkler
(`document.querySelectorAll('a')` — çağrı anında sorgulanır, intro klonları hariç)
sırayla ele alınır:
- Her link, kendinden `i * 75ms` sonra rastgele neon renge boyanır (metin + varsa
  `svg path` fill), **750ms** sonra eski rengine döner.
- Aynı anda ~2 link renkli olur (750ms tutma + 75ms kayma), akıcı bir dalga oluşur.

**Tekrar:** `tourMs = link_sayısı * 100 + 200`, `pauseMs = 15000`; her `tourMs + pauseMs`
periyodunda tekrarlanır — **ancak** o sırada gerçek bir hover animasyonu oynuyorsa
(`isHoverAnimating`) atlanır. Aralık, ilk tur sonrası gerçek link sayısına göre
hesaplanır (intro klonlarının sayıyı şişirmesini önlemek için).

> Not: `750ms` tutma ve `75ms` kayma değerleri elle ayarlanabilir sabitlerdir; hız
> tercihine göre değiştirilebilir.

---

## 5. Her yüklemede rastgele renk (animasyon değil ama "canlı" his)

**Dosya:** [`js/random-link-color.js`](js/random-link-color.js).
**Tetikleyici:** her sayfa yüklemesi.

Hareket içermez ama tema kimliğinin parçasıdır: her yüklemede tek bir rastgele hue
üretilir ve
- `--inline-link-color` CSS değişkenine atanır (paragraf içi linkler `section p a`
  bu rengi kullanır),
- aynı renkte bir daire **favicon** olarak data-URI SVG ile üretilir.

Böylece site her ziyarette (ve her yenilemede) farklı bir vurgu rengiyle açılır.

---

## 6. CSS hover renk geçişleri

**Dosya:** [`css/index.css`](css/index.css).
İletişim ikonları (`#contact a svg path` `#8E9094→#adb0b6`), linkler
(`section a`, `#lang-switcher a`, `a.more`) hover'da açık griye döner. Tanımlı bir
`transition` **yoktur** → renk değişimi anlıktır (kasıtlı, "terminal" hissi).

---

## Özet tablo

| # | Animasyon | Dosya | Tetikleyici | Reduced-motion |
|---|---|---|---|---|
| 1 | Açılış sekansı (şerit + logo + içerik toplanması) | mv.js | yükleme | atlanır |
| 2 | Profil glitch avatarı | profile-glitch.js | sürekli/görünürken | statik kare |
| 3 | Hover link parçalanması | mv.js | link hover (masaüstü) | (hover kullanıcı kaynaklı) |
| 4 | Otomatik link tanıtım turu | mv.js | 2800ms + periyodik | atlanır |
| 5 | Yüklemede rastgele renk + favicon | random-link-color.js | her yükleme | etkilenmez |
| 6 | Hover renk geçişleri | index.css | hover | etkilenmez |
