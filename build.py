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

import datetime
import html as H
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCE_LANG = "tr"
SITE = "https://emreuctepe.com"
MIN_COVERAGE = 0.90
PAGES = ("index.html", "privacy.html")


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
        scope = _blank_out(text, r">[^<]*(?=<|$)")
    else:
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
    page = page.replace('<html lang="%s">' % SOURCE_LANG, '<html lang="%s" data-i18n-static>' % lang, 1)

    page = re.sub(r'(\s(?:href|src)=")(css/|js/|images/|lang/)', r"\1../\2", page)

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


def page_path(lang, page):
    """Sayfanin depo icindeki yolu. Kaynak dil kokte, digerleri alt klasorde."""
    return page if lang == SOURCE_LANG else "%s/%s" % (lang, page)


def page_url(lang, page):
    """Sayfanin yayindaki adresi. index.html adreste gorunmez, klasorun kendisi
    o sayfadir - /en/index.html ile /en/ ayni icerigi iki adresten sunar."""
    prefix = "" if lang == SOURCE_LANG else "%s/" % lang
    return "%s/%s%s" % (SITE, prefix, "" if page == "index.html" else page)


def _git(*args):
    """Git ciktisini dondurur; komut basarisiz olursa ya da git yoksa None."""
    try:
        run = subprocess.run(("git",) + args, cwd=ROOT, capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.SubprocessError):
        return None
    return run.stdout.strip() if run.returncode == 0 else None


def last_modified(rel):
    """Sayfanin gercek son degisim tarihi.

    Neden git: her build'de bugunun tarihini basmak lastmod'u degersizlestirir -
    icerigi degismedigi halde surekli 'degisti' diyen sitemap'lere arama
    motorlari guvenmeyi birakiyor. Calisma kopyasi HEAD'den farkliysa degisiklik
    bugun yapilmistir; ayniysa dogru cevap son commit tarihidir.

    Uretilen sayfalar icin bu kendiliginden dogru calisir: ceviri ciktisi
    degismediyse dosya da degismez, tarih eskide kalir."""
    today = datetime.date.today().isoformat()
    if _git("diff", "--quiet", "HEAD", "--", rel) is None:
        return today
    return _git("log", "-1", "--format=%cs", "--", rel) or today


def build_sitemap(langs):
    """Var olan her sayfayi hreflang kumesiyle birlikte sitemap.xml'e yazar.

    Her <url> blogu kumenin tamamini - kendisini de - tekrar eder; eksik ya da
    tek yonlu hreflang, Google'in kumeyi bastan yok saymasina yol aciyor.
    <priority> ve <changefreq> bilerek yok: Google 2023'ten beri ikisini de
    yok sayiyor, yazmak dosyayi sisirmekten baska ise yaramiyor."""
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    count = 0

    for page in PAGES:
        present = [l for l in langs if os.path.exists(os.path.join(ROOT, page_path(l, page)))]
        if SOURCE_LANG not in present:
            continue

        for lang in present:
            lines.append("")
            lines.append("  <url>")
            lines.append("    <loc>%s</loc>" % page_url(lang, page))
            lines.append("    <lastmod>%s</lastmod>" % last_modified(page_path(lang, page)))
            for alt in present:
                lines.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>'
                             % (alt, page_url(alt, page)))
            lines.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>'
                         % page_url(SOURCE_LANG, page))
            lines.append("  </url>")
            count += 1

    lines += ["", "</urlset>", ""]
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return count


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

    print("URETILDI sitemap.xml      - %d adres" % build_sitemap([SOURCE_LANG] + langs))

    if problems:
        sys.exit(1)


if __name__ == "__main__":
    main()
