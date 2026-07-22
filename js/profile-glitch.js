"use strict";

// glitch/index.html'deki Glitch sinifinin p5.js "instance mode" ile uyarlanmis hali.
// Mantik birebir ayni; sadece cikplak p5 fonksiyonlari (floor, random, image, push, pop)
// yerine bu.p.floor, bu.p.random vb. kullaniliyor - instance mode global fonksiyon saglamiyor.
class Glitch {
  constructor(img, p) {
    this.p = p;
    this.channelLen = 4;
    this.imgOrigin = img;
    this.imgOrigin.loadPixels();
    this.copyData = new Uint8ClampedArray(this.imgOrigin.pixels);
    this.flowLineImgs = [];
    this.shiftLineImgs = [];
    this.shiftRGBs = [];
    this.scatImgs = [];
    this.throughFlag = true;

    for (let i = 0; i < 1; i++) {
      this.flowLineImgs.push({
        pixels: null,
        t1: p.floor(p.random(0, 1000)),
        speed: p.floor(p.random(4, 24)),
        randX: p.floor(p.random(24, 80)),
      });
    }

    for (let i = 0; i < 6; i++) {
      this.shiftLineImgs.push(null);
    }

    for (let i = 0; i < 1; i++) {
      this.shiftRGBs.push(null);
    }

    for (let i = 0; i < 3; i++) {
      this.scatImgs.push({ img: null, x: 0, y: 0 });
    }
  }

  replaceData(destImg, srcPixels) {
    for (let y = 0; y < destImg.height; y++) {
      for (let x = 0; x < destImg.width; x++) {
        let index = (y * destImg.width + x) * this.channelLen;
        destImg.pixels[index] = srcPixels[index];
        destImg.pixels[index + 1] = srcPixels[index + 1];
        destImg.pixels[index + 2] = srcPixels[index + 2];
        destImg.pixels[index + 3] = srcPixels[index + 3];
      }
    }
    destImg.updatePixels();
  }

  flowLine(srcImg, obj) {
    const p = this.p;
    let destPixels = new Uint8ClampedArray(srcImg.pixels);
    obj.t1 %= srcImg.height;
    obj.t1 += obj.speed;
    let tempY = p.floor(obj.t1);
    for (let y = 0; y < srcImg.height; y++) {
      if (tempY === y) {
        for (let x = 0; x < srcImg.width; x++) {
          let index = (y * srcImg.width + x) * this.channelLen;
          destPixels[index] = srcImg.pixels[index] + obj.randX;
          destPixels[index + 1] = srcImg.pixels[index + 1] + obj.randX;
          destPixels[index + 2] = srcImg.pixels[index + 2] + obj.randX;
          destPixels[index + 3] = srcImg.pixels[index + 3];
        }
      }
    }
    return destPixels;
  }

  shiftLine(srcImg) {
    const p = this.p;
    let destPixels = new Uint8ClampedArray(srcImg.pixels);
    let rangeH = srcImg.height;
    let rangeMin = p.floor(p.random(0, rangeH));
    let rangeMax = rangeMin + p.floor(p.random(1, rangeH - rangeMin));
    let offsetX = this.channelLen * p.floor(p.random(-40, 40));

    for (let y = 0; y < srcImg.height; y++) {
      if (y > rangeMin && y < rangeMax) {
        for (let x = 0; x < srcImg.width; x++) {
          let index = (y * srcImg.width + x) * this.channelLen;
          let r2 = index + offsetX;
          let g2 = index + 1 + offsetX;
          let b2 = index + 2 + offsetX;
          destPixels[index] = srcImg.pixels[r2];
          destPixels[index + 1] = srcImg.pixels[g2];
          destPixels[index + 2] = srcImg.pixels[b2];
          destPixels[index + 3] = srcImg.pixels[index + 3];
        }
      }
    }
    return destPixels;
  }

  shiftRGB(srcImg) {
    const p = this.p;
    let range = 16;
    let destPixels = new Uint8ClampedArray(srcImg.pixels);
    let randR = (p.floor(p.random(-range, range)) * srcImg.width + p.floor(p.random(-range, range))) * this.channelLen;
    let randG = (p.floor(p.random(-range, range)) * srcImg.width + p.floor(p.random(-range, range))) * this.channelLen;
    let randB = (p.floor(p.random(-range, range)) * srcImg.width + p.floor(p.random(-range, range))) * this.channelLen;

    for (let y = 0; y < srcImg.height; y++) {
      for (let x = 0; x < srcImg.width; x++) {
        let index = (y * srcImg.width + x) * this.channelLen;
        let r2 = (index + randR) % srcImg.pixels.length;
        let g2 = (index + 1 + randG) % srcImg.pixels.length;
        let b2 = (index + 2 + randB) % srcImg.pixels.length;
        destPixels[index] = srcImg.pixels[r2];
        destPixels[index + 1] = srcImg.pixels[g2];
        destPixels[index + 2] = srcImg.pixels[b2];
        destPixels[index + 3] = srcImg.pixels[index + 3];
      }
    }
    return destPixels;
  }

  getRandomRectImg(srcImg) {
    const p = this.p;
    let startX = p.floor(p.random(0, srcImg.width - 30));
    let startY = p.floor(p.random(0, srcImg.height - 50));
    let rectW = p.floor(p.random(30, srcImg.width - startX));
    let rectH = p.floor(p.random(1, 50));
    let destImg = srcImg.get(startX, startY, rectW, rectH);
    destImg.loadPixels();
    return destImg;
  }

  show() {
    const p = this.p;

    this.replaceData(this.imgOrigin, this.copyData);

    let n = p.floor(p.random(100));
    if (n > 75 && this.throughFlag) {
      this.throughFlag = false;
      this.throughUntilMs = p.millis() + p.floor(p.random(3000, 4000));
    }
    if (!this.throughFlag) {
      if (p.millis() >= this.throughUntilMs) {
        this.throughFlag = true;
      } else {
        p.push();
        p.translate((p.width - this.imgOrigin.width) / 2, (p.height - this.imgOrigin.height) / 2);
        p.image(this.imgOrigin, 0, 0);
        p.pop();
        return;
      }
    }

    this.flowLineImgs.forEach((v, i, arr) => {
      arr[i].pixels = this.flowLine(this.imgOrigin, v);
      if (arr[i].pixels) {
        this.replaceData(this.imgOrigin, arr[i].pixels);
      }
    });

    this.shiftLineImgs.forEach((v, i, arr) => {
      if (p.floor(p.random(100)) > 50) {
        arr[i] = this.shiftLine(this.imgOrigin);
        this.replaceData(this.imgOrigin, arr[i]);
      } else if (arr[i]) {
        this.replaceData(this.imgOrigin, arr[i]);
      }
    });

    this.shiftRGBs.forEach((v, i, arr) => {
      if (p.floor(p.random(100)) > 65) {
        arr[i] = this.shiftRGB(this.imgOrigin);
        this.replaceData(this.imgOrigin, arr[i]);
      }
    });

    p.push();
    p.translate((p.width - this.imgOrigin.width) / 2, (p.height - this.imgOrigin.height) / 2);
    p.image(this.imgOrigin, 0, 0);
    p.pop();

    this.scatImgs.forEach((obj) => {
      p.push();
      p.translate((p.width - this.imgOrigin.width) / 2, (p.height - this.imgOrigin.height) / 2);
      if (p.floor(p.random(100)) > 80) {
        obj.x = p.floor(p.random(-this.imgOrigin.width * 0.3, this.imgOrigin.width * 0.7));
        obj.y = p.floor(p.random(-this.imgOrigin.height * 0.1, this.imgOrigin.height));
        obj.img = this.getRandomRectImg(this.imgOrigin);
      }
      if (obj.img) {
        p.image(obj.img, obj.x, obj.y);
      }
      p.pop();
    });
  }
}

const profileGlitchSketch = (p) => {
  let isLoaded = false;
  let glitch;
  const SIZE = 120; // eski logo alani kadar kucuk, sabit bir canvas

  p.setup = () => {
    p.createCanvas(SIZE, SIZE);
    p.loadImage('images/IMG_6924.jpeg', (img) => {
      // Glitch sinifindaki tum piksel islemleri resmin gercek boyutunda dongu kuruyor.
      // Telefon fotografi gibi buyuk cozunurluklu bir gorsel resize edilmeden kullanilirsa
      // her karede milyonlarca piksel islenir ve ciddi performans sorunu (kasma) olusur.
      img.resize(SIZE, SIZE);
      glitch = new Glitch(img, p);
      isLoaded = true;
    });
  };

  p.draw = () => {
    p.clear();
    p.background(0);
    if (isLoaded) {
      glitch.show();
    }
  };
};

new p5(profileGlitchSketch, document.getElementById('profile-glitch-canvas'));
