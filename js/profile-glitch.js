"use strict";

// Profil "glitch" avatari.
// Eskiden bu efekt p5.js (~950KB, CDN) ile yapiliyordu; artik hicbir bagimlilik
// olmadan, saf Canvas 2D ile uretiliyor. Piksel manipulasyon mantigi (flowLine /
// shiftLine / shiftRGB / scatter) eski surumle birebir ayni; sadece p5'in image /
// pixels API'si yerine dogrudan ImageData/Uint8ClampedArray kullaniliyor.
//
// Ek olarak:
//  - ~20fps'e sinirlandi (eski surum 60fps'te surekli piksel isliyordu),
//  - canvas gorunmediginde / sekme gizlendiginde durur (IntersectionObserver +
//    visibilitychange) -> arka planda bosuna CPU/pil yakmaz,
//  - prefers-reduced-motion aciksa animasyon yerine tek statik kare gosterilir.
(function () {
  const container = document.getElementById("profile-glitch-canvas");
  if (!container) return;

  const SIZE = 120;
  const CH = 4; // RGBA
  const floor = Math.floor;
  const now = () => performance.now();
  // p5.random uyumlulugu: random(max) -> [0,max), random(min,max) -> [min,max)
  const random = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  container.appendChild(canvas);

  const frameID = ctx.createImageData(SIZE, SIZE); // her kare buraya yazilip ekrana basilir
  const scratch = document.createElement("canvas"); // scatter parcalari / ilk olcekleme icin
  const sctx = scratch.getContext("2d");

  function blit(buf) {
    frameID.data.set(buf);
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.putImageData(frameID, 0, 0);
  }

  function drawPiece(piece, x, y) {
    scratch.width = piece.w;
    scratch.height = piece.h;
    const pid = sctx.createImageData(piece.w, piece.h);
    pid.data.set(piece.data);
    sctx.putImageData(pid, 0, 0);
    ctx.drawImage(scratch, x, y);
  }

  class Glitch {
    constructor(pristine, w, h) {
      this.w = w;
      this.h = h;
      this.origin = pristine; // pristine kopya (hic degismez)
      this.buf = new Uint8ClampedArray(pristine); // her karede uzerinde calisilan tampon
      this.throughFlag = true;
      this.throughUntil = 0;
      this.flowLineImgs = [{
        pixels: null,
        t1: floor(random(0, 1000)),
        speed: floor(random(4, 24)),
        randX: floor(random(24, 80)),
      }];
      this.shiftLineImgs = new Array(6).fill(null);
      this.shiftRGBs = new Array(1).fill(null);
      this.scatImgs = [
        { img: null, x: 0, y: 0 },
        { img: null, x: 0, y: 0 },
        { img: null, x: 0, y: 0 },
      ];
    }

    flowLine(src, obj) {
      const w = this.w, h = this.h;
      const dest = new Uint8ClampedArray(src);
      obj.t1 %= h;
      obj.t1 += obj.speed;
      const tempY = floor(obj.t1);
      for (let y = 0; y < h; y++) {
        if (tempY === y) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * CH;
            dest[i] = src[i] + obj.randX;
            dest[i + 1] = src[i + 1] + obj.randX;
            dest[i + 2] = src[i + 2] + obj.randX;
            dest[i + 3] = src[i + 3];
          }
        }
      }
      return dest;
    }

    shiftLine(src) {
      const w = this.w, h = this.h;
      const dest = new Uint8ClampedArray(src);
      const rangeMin = floor(random(0, h));
      const rangeMax = rangeMin + floor(random(1, h - rangeMin));
      const offsetX = CH * floor(random(-40, 40));
      for (let y = 0; y < h; y++) {
        if (y > rangeMin && y < rangeMax) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * CH;
            dest[i] = src[i + offsetX];
            dest[i + 1] = src[i + 1 + offsetX];
            dest[i + 2] = src[i + 2 + offsetX];
            dest[i + 3] = src[i + 3];
          }
        }
      }
      return dest;
    }

    shiftRGB(src) {
      const w = this.w, h = this.h, len = src.length, range = 16;
      const dest = new Uint8ClampedArray(src);
      const randR = (floor(random(-range, range)) * w + floor(random(-range, range))) * CH;
      const randG = (floor(random(-range, range)) * w + floor(random(-range, range))) * CH;
      const randB = (floor(random(-range, range)) * w + floor(random(-range, range))) * CH;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * CH;
          // Not: (i + randR) negatif olabilir; eski p5 surumu de bu durumda
          // undefined -> 0 (siyah) davraniyordu, ayni sekilde birakildi.
          dest[i] = src[(i + randR) % len];
          dest[i + 1] = src[(i + 1 + randG) % len];
          dest[i + 2] = src[(i + 2 + randB) % len];
          dest[i + 3] = src[i + 3];
        }
      }
      return dest;
    }

    getRandomRect(src) {
      const w = this.w, h = this.h;
      const sx = floor(random(0, w - 30));
      const sy = floor(random(0, h - 50));
      const sw = floor(random(30, w - sx));
      const sh = floor(random(1, 50));
      const out = new Uint8ClampedArray(sw * sh * CH);
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const si = ((sy + y) * w + (sx + x)) * CH;
          const di = (y * sw + x) * CH;
          out[di] = src[si];
          out[di + 1] = src[si + 1];
          out[di + 2] = src[si + 2];
          out[di + 3] = src[si + 3];
        }
      }
      return { data: out, w: sw, h: sh };
    }

    render() {
      // her kare pristine kopyadan basla (eski: replaceData(imgOrigin, copyData))
      this.buf.set(this.origin);

      const n = floor(random(100));
      if (n > 75 && this.throughFlag) {
        this.throughFlag = false;
        this.throughUntil = now() + floor(random(15000, 20000));
      }
      if (!this.throughFlag) {
        if (now() >= this.throughUntil) {
          this.throughFlag = true;
        } else {
          blit(this.buf); // temiz (pristine) goruntu goster
          return;
        }
      }

      this.flowLineImgs.forEach((v) => {
        v.pixels = this.flowLine(this.buf, v);
        this.buf.set(v.pixels);
      });

      this.shiftLineImgs.forEach((v, i, arr) => {
        if (floor(random(100)) > 50) {
          arr[i] = this.shiftLine(this.buf);
          this.buf.set(arr[i]);
        } else if (arr[i]) {
          this.buf.set(arr[i]);
        }
      });

      this.shiftRGBs.forEach((v, i, arr) => {
        if (floor(random(100)) > 65) {
          arr[i] = this.shiftRGB(this.buf);
          this.buf.set(arr[i]);
        }
      });

      blit(this.buf);

      this.scatImgs.forEach((obj) => {
        if (floor(random(100)) > 80) {
          obj.x = floor(random(-this.w * 0.3, this.w * 0.7));
          obj.y = floor(random(-this.h * 0.1, this.h));
          obj.img = this.getRandomRect(this.buf);
        }
        if (obj.img) {
          drawPiece(obj.img, obj.x, obj.y);
        }
      });
    }
  }

  // --- animasyon dongusu (throttle + gorunurluk kontrolu) ---
  let glitch = null;
  let running = false;
  let rafId = null;
  let last = 0;
  const FRAME_MS = 1000 / 20; // ~20fps
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (t - last < FRAME_MS) return;
    last = t;
    glitch.render();
  }
  function start() {
    if (running || !glitch || reduce) return;
    running = true;
    last = 0;
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Once optimize edilmis kucuk WebP denenir; yoksa mevcut JPEG'e duser.
  // (avatar-240.webp henuz uretilmediyse site calismaya devam eder.)
  function loadFirstAvailable(sources, onload) {
    let idx = 0;
    const img = new Image();
    img.onload = () => onload(img);
    img.onerror = () => {
      idx += 1;
      if (idx < sources.length) img.src = sources[idx];
    };
    img.src = sources[0];
  }

  loadFirstAvailable(["images/avatar-240.webp", "images/IMG_6924.jpeg"], (img) => {
    // Telefon fotografi (2315x2315) resize edilmeden kullanilirsa her karede
    // milyonlarca piksel islenir; 120px'e olcekleyip pristine pikselleri aliyoruz.
    scratch.width = SIZE;
    scratch.height = SIZE;
    sctx.clearRect(0, 0, SIZE, SIZE);
    sctx.drawImage(img, 0, 0, SIZE, SIZE);
    const pristine = sctx.getImageData(0, 0, SIZE, SIZE).data;
    glitch = new Glitch(new Uint8ClampedArray(pristine), SIZE, SIZE);

    if (reduce) {
      blit(glitch.origin); // hareket azaltma: tek statik kare
      return;
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? start() : stop();
      }).observe(container);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });
  });
})();
