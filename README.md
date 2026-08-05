# emreuctepe.com

Kişisel portfolio sitesi. Geliştirme aşamasında.

## Çeviri

Tüm diller tek dosyada, tablo halinde: [`lang/strings.js`](lang/strings.js).
Her satır bir metin, `tr / en / ja` sütunları yan yana. Çeviri eklemek için
sadece bu dosyayı düzenle.

Boş hücre (`""`) = "henüz çevrilmedi" demek; o metin Türkçe kalır, site bozulmaz.

**Ama metin hedef dilde aynı kalacaksa hücreyi boş bırakma — Türkçesini kopyala.**
Özel isimler, alan adları, dizi/film adları için geçerli. Boş hücre build için
"çevrilmedi" sayılır ve aşağıdaki %90 eşiğini aşağı çeker; tabloda böyle ~19 satır
var, hepsi boş kalırsa o dil hiç üretilemez.

Türkçe metin `index.html` içinde de duruyor (JS yüklenmeden önce görünen metin).
Bir Türkçe metni değiştirirken hem `index.html`'i hem tablonun `tr` sütununu
güncelle.

HTML'de üç bağlama biçimi var, üçü de aynı tabloyu kullanır:

| Attribute | Neyi değiştirir | Örnek |
| --- | --- | --- |
| `data-i18n` | elemanın metni | `<h2 data-i18n="about_title">` |
| `data-i18n-content` | `content` attribute'u | `<meta data-i18n-content="page_desc">` |
| `data-i18n-label` | `aria-label` | `<div data-i18n-label="profile_alt">` |

Yeni dil eklemek: tablodaki her satıra yeni bir sütun ekle (ör. `de: "..."`) ve
`js/i18n.js` içindeki `SUPPORTED` listesine dil kodunu yaz.

## Build (dil başına statik sayfa)

```
python3 build.py
```

`index.html` + `lang/strings.js`'den `en/index.html` ve `ja/index.html` üretir.
Bunlar arama motorunun indeksleyebildiği gerçek sayfalardır — `?lang=en` gibi bir
sorgu parametresi ayrı sayfa sayılmaz. Üretilen sayfalarda metin HTML'e gömülü
olduğu için JS kapalıyken de doğru dilde açılırlar.

Bir dil %90'dan az çevrildiyse atlanır (Türkçe metni "bu sayfa İngilizce" diye
etiketlemek SEO'ya zarar verir). Yine de üretmek için `python3 build.py --force`.

`en/` ve `ja/` klasörlerindeki **`index.html`**'i elle düzenleme — her build'de
üzerine yazılır.

Tek istisna `privacy.html`. Gizlilik metni üç dilde ayrı ayrı elle yazılıyor
(`privacy.html`, `en/privacy.html`, `ja/privacy.html`); `build.py` yalnızca
`{lang}/index.html` ürettiği için bu dosyalara dokunmaz. Hukuki metin uzun
düzyazı, `lang/strings.js` ise kısa arayüz dizeleri için — ayrıca oradaki her
satır yukarıdaki %90 eşiğinin paydasına giriyor. Metni değiştirirken üç dosyayı
birlikte güncelle.

### Gizli karakter denetimi

Build her çalıştığında önce kaynak dosyaları tarar. Aradığı şey, kodun içine
kazayla girmiş görünmez karakterler — en sık sebebi Japonca IME açıkken kod
yazmak: hiragana modunda boşluk tuşu ASCII boşluk değil, tam genişlikli boşluk
(U+3000) üretir. `<h1　data-i18n="name">` gibi bir satır tarayıcıda sessizce
bozulur, hata da vermez.

Sadece denetlemek için:

```
python3 build.py --check
```

Denetim yalnızca **kod bağlamına** bakar: HTML'de etiketlerin içi, JS'te string
literallerinin dışı. Japonca çeviri metninin içindeki U+3000 meşrudur ve
raporlanmaz.
