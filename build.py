#!/usr/bin/env python3
"""index.html + lang/strings.js -> en/index.html, ja/index.html uretir.

Neden: ?lang=en gibi bir sorgu parametresi Google icin ayri bir sayfa DEGILDIR;
arama motoru sadece Turkce surumu indeksler, EN/JA icerigi hic gorunmez. Ayri
yollar (/en/, /ja/) + hreflang standart cozum. Ayrica uretilen sayfalar JS
kapaliyken de dogru dilde acilir ve dil degisiminde metin titremesi olmaz.

Kaynak tek: Turkce metin index.html'de, cevirileri lang/strings.js'de yasar.
Uretilen klasorleri (en/, ja/) elle duzenleme - her build'de uzerine yazilir.

Kullanim:
    python3 build.py            # kaynaklari denetler, sonra uretir
    python3 build.py --check    # sadece denetle, hicbir sey uretme
    python3 build.py --force    # eksik cevirilere ragmen yine de uret
"""

import html as H
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCE_LANG = "tr"
SITE = "https://emreuctepe.com"
# Bir dili uretmek icin gereken en dusuk ceviri orani. Bunun altinda uretilen
# sayfa Turkce metni "bu sayfa Ingilizce" diye etiketler - SEO icin zararli.
MIN_COVERAGE = 0.90


# Kodun ICINDE bulunmasi neredeyse her zaman kaza olan, gozle ayirt edilemeyen
# karakterler. En sik kaynagi: Japonca IME acikken kod yazmak - hiragana modunda
# bosluk tusu ASCII bosluk degil, tam genislikli bosluk (U+3000) uretir.
# <h1　data-i18n="name"> gibi bir satir tarayicida sessizce bozulur: HTML etiket
# adini yalnizca ASCII bosluk bitirdigi icin element "h1" olmaktan cikar.
INVISIBLE = {
    "　": "U+3000 tam genislikli bosluk (Japonca IME)",
    " ": "U+00A0 kirilmaz bosluk",
    "​": "U+200B genisligi sifir bosluk",
    "﻿": "U+FEFF BOM / genisligi sifir kirilmaz bosluk",
    "­": "U+00AD yumusak tire",
}


def _blank_out(text, pattern):
    """Eslesen bolgeleri ayni uzunlukta bosluga cevirir - satir/sutun numaralari
    bozulmasin diye. Boylece 'sadece su bolgeye bak' filtreleri kurulabilir."""
    return re.sub(pattern, lambda m: re.sub(r"[^\n]", " ", m.group(0)), text, flags=re.S)


def check_invisible(path):
    """Kod baglaminda gizli karakter arar.

    Onemli olan ayrim: bu karakterler METIN ICINDE mesrudur (Japonca cevirilerde
    U+3000 gercekten kullanilir), KOD icinde degildir. Bu yuzden:
      - .html icin sadece etiketlerin ici (<...>) taranir, govde metni taranmaz.
      - .js / .py icin string literalleri disarida birakilir.
    Bu sayede yanlis alarm uretmez."""
    text = open(path, encoding="utf-8").read()

    if path.endswith(".html"):
        # Etiket disindaki her seyi (yani gorunur metni) sil, geriye etiketler kalsin.
        scope = _blank_out(text, r">[^<]*(?=<|$)")
    else:
        # Once yorumlar, sonra string literalleri temizlenir.
        scope = _blank_out(text, r"//[^\n]*|#[^\n]*")
        scope = _blank_out(scope, r'"""(?:[^"\\]|\\.|"(?!""))*"""')
        scope = _blank_out(scope, r'"(?:[^"\\\n]|\\.)*"' r"|'(?:[^'\\\n]|\\.)*'" r"|`(?:[^`\\]|\\.)*`")

    hits = []
    for offset, char in enumerate(scope):
        if char in INVISIBLE:
            line = scope.count("\n", 0, offset) + 1
            col = offset - (scope.rfind("\n", 0, offset) + 1) + 1
            hits.append((line, col, INVISIBLE[char]))
    return hits


def check_sources(paths):
    """Denetimi calistirir, bulgulari yazar, sorunlu dosya sayisini dondurur."""
    total = 0
    for rel in paths:
        full = os.path.join(ROOT, rel)
        if not os.path.exists(full):
            continue
        for line, col, why in check_invisible(full):
            print("GIZLI KARAKTER %s:%d:%d  %s" % (rel, line, col, why))
            total += 1
    if total:
        print("\n%d gizli karakter kod icinde bulundu. Bunlar gozle gorunmez ama\n"
              "HTML/JS'i sessizce bozar - duzeltmeden yayina alma." % total)
    return total


def load_strings(path):
    """lang/strings.js icindeki tabloyu okur. Tam bir JS parser degil; dosyanin
    'key: { tr: "...", en: "...", ja: "..." },' duzenini korudugunu varsayar."""
    src = open(path, encoding="utf-8").read()
    src = re.sub(r"//[^\n]*", "", src)
    table = {}
    row_re = re.compile(r"(\w+)\s*:\s*\{(.*?)\}\s*,", re.S)
    cell_re = re.compile(r'(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"')
    for key, body in row_re.findall(src):
        cells = {}
        for lang, raw in cell_re.findall(body):
            cells[lang] = raw.encode().decode("unicode_escape") if "\\" in raw else raw
        table[key] = cells
    return table


def coverage(table, lang):
    total = len(table)
    done = sum(1 for row in table.values() if row.get(lang))
    return done, total


def translate(page, table, lang):
    """data-i18n / -content / -label tasiyan her elemani hedef dile cevirir."""

    def text_sub(m):
        row = table.get(m.group("key"), {})
        value = row.get(lang)
        return m.group("open") + H.escape(value, quote=False) + m.group("close") if value else m.group(0)

    # <tag ... data-i18n="key" ...>METIN</tag> - icerigi duz metin olan elemanlar.
    page = re.sub(
        r'(?P<open><(?P<tag>\w+)[^>]*\sdata-i18n="(?P<key>[^"]+)"[^>]*>)'
        r"(?P<body>[^<]*)"
        r"(?P<close></(?P=tag)>)",
        text_sub,
        page,
    )

    def attr_sub(attr):
        def inner(m):
            row = table.get(m.group("key"), {})
            value = row.get(lang)
            if not value:
                return m.group(0)
            # (?<![-\w]) olmadan "content" deseni "data-i18n-content"in kendisiyle
            # eslesir ve key'in uzerine yazar.
            return re.sub(
                r'(?<![-\w])%s="[^"]*"' % attr,
                '%s="%s"' % (attr, H.escape(value, quote=True)),
                m.group(0),
                count=1,
            )

        return inner

    page = re.sub(r'<[^>]*\sdata-i18n-content="(?P<key>[^"]+)"[^>]*>', attr_sub("content"), page)
    page = re.sub(r'<[^>]*\sdata-i18n-label="(?P<key>[^"]+)"[^>]*>', attr_sub("aria-label"), page)
    return page


def localize_page(page, lang):
    """Yol, dil etiketi ve canonical gibi sayfa-disi ayarlari alt klasore uyarlar."""
    # Metin artik HTML'e gomulu: i18n.js'e "tekrar cevirme, sadece switcher'i bagla" de.
    page = page.replace('<html lang="%s">' % SOURCE_LANG, '<html lang="%s" data-i18n-static>' % lang, 1)

    # Sayfa bir alt klasore tasindi; koke goreli varlik yollari bir seviye yukari.
    page = re.sub(r'(\s(?:href|src)=")(css/|js/|images/|lang/)', r"\1../\2", page)

    # Dil secici: koktekiler JS ile calisan href="#" baglantilari. Uretilen
    # sayfalarda bunlari gercek yollara cevir - boylece JS'siz de calisirlar ve
    # arama motoru diger dilleri takip edebilir. Turkce koke (..), digerleri
    # kardes klasore (../en/) gider.
    def switcher(m):
        target = m.group(1)
        return 'href="%s" data-lang="%s"' % ("../" if target == SOURCE_LANG else "../%s/" % target, target)

    page = re.sub(r'href="[^"]*" data-lang="(\w+)"', switcher, page)

    page = page.replace(
        '<link rel="canonical" href="%s/">' % SITE,
        '<link rel="canonical" href="%s/%s/">' % (SITE, lang),
        1,
    )
    page = page.replace(
        '<meta property="og:url" content="%s/">' % SITE,
        '<meta property="og:url" content="%s/%s/">' % (SITE, lang),
        1,
    )
    return page


def main():
    force = "--force" in sys.argv
    check_only = "--check" in sys.argv

    problems = check_sources(["index.html", "lang/strings.js", "js/i18n.js"])
    if check_only:
        if not problems:
            print("Denetim temiz: kod icinde gizli karakter yok.")
        sys.exit(1 if problems else 0)

    table = load_strings(os.path.join(ROOT, "lang", "strings.js"))
    source = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

    langs = sorted({l for row in table.values() for l in row} - {SOURCE_LANG})
    if not langs:
        sys.exit("lang/strings.js icinde %s disinda dil sutunu yok." % SOURCE_LANG)

    built = []
    for lang in langs:
        done, total = coverage(table, lang)
        ratio = done / total if total else 0
        if ratio < MIN_COVERAGE and not force:
            print("ATLANDI  %s  - %d/%d cevrildi (%.0f%%), esik %.0f%%. "
                  "Once tabloyu doldur ya da --force kullan."
                  % (lang, done, total, ratio * 100, MIN_COVERAGE * 100))
            continue

        page = localize_page(translate(source, table, lang), lang)
        out_dir = os.path.join(ROOT, lang)
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(page)
        print("URETILDI %s/index.html  - %d/%d cevrildi (%.0f%%)" % (lang, done, total, ratio * 100))
        built.append(lang)

    if not built:
        print("\nHicbir sayfa uretilmedi. Bu beklenen durum: lang/strings.js'deki "
              "en/ja sutunlari hala bos.")

    # Gizli karakter bulunduysa build yine de yapilir (metin dogru cikar) ama
    # cikis kodu 0 olmaz - ileride bir git hook'u ya da CI bunu yakalayabilsin.
    if problems:
        sys.exit(1)


if __name__ == "__main__":
    main()
