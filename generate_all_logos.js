const fs = require('fs');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

async function generateAll() {
  const fullDark = await loadImage('public/images/logo/knowza-logo-dark.png');
  const w = fullDark.width;
  const h = fullDark.height;

  // Extract Mark (y: 0 to 385)
  // Extract Wordmark (y: 385 to h)
  const fullCanvas = createCanvas(w, h);
  const fCtx = fullCanvas.getContext('2d');
  fCtx.drawImage(fullDark, 0, 0);

  // 1. Mark only
  // Find mark bbox
  const markCanvas = createCanvas(w, 385);
  const mCtx = markCanvas.getContext('2d');
  mCtx.drawImage(fullCanvas, 0, 0, w, 385, 0, 0, w, 385);

  // Find tight bbox of mark
  const mData = mCtx.getImageData(0, 0, w, 385).data;
  let mMinX = w, mMaxX = 0, mMinY = 385, mMaxY = 0;
  for (let y = 0; y < 385; y++) {
    for (let x = 0; x < w; x++) {
      if (mData[(y * w + x) * 4 + 3] > 50) {
        if (x < mMinX) mMinX = x;
        if (x > mMaxX) mMaxX = x;
        if (y < mMinY) mMinY = y;
        if (y > mMaxY) mMaxY = y;
      }
    }
  }

  const markW = mMaxX - mMinX + 1;
  const markH = mMaxY - mMinY + 1;
  const markTight = createCanvas(markW, markH);
  markTight.getContext('2d').drawImage(markCanvas, mMinX, mMinY, markW, markH, 0, 0, markW, markH);

  // 2. Wordmark only
  const wordCanvas = createCanvas(w, h - 385);
  const wCtx = wordCanvas.getContext('2d');
  wCtx.drawImage(fullCanvas, 0, 385, w, h - 385, 0, 0, w, h - 385);

  const wData = wCtx.getImageData(0, 0, w, h - 385).data;
  let wMinX = w, wMaxX = 0, wMinY = h - 385, wMaxY = 0;
  for (let y = 0; y < h - 385; y++) {
    for (let x = 0; x < w; x++) {
      if (wData[(y * w + x) * 4 + 3] > 50) {
        if (x < wMinX) wMinX = x;
        if (x > wMaxX) wMaxX = x;
        if (y < wMinY) wMinY = y;
        if (y > wMaxY) wMaxY = y;
      }
    }
  }

  const wordW = wMaxX - wMinX + 1;
  const wordH = wMaxY - wMinY + 1;
  const wordTight = createCanvas(wordW, wordH);
  wordTight.getContext('2d').drawImage(wordCanvas, wMinX, wMinY, wordW, wordH, 0, 0, wordW, wordH);

  function colorize(sourceCanvas, r, g, b) {
    const sw = sourceCanvas.width;
    const sh = sourceCanvas.height;
    const result = createCanvas(sw, sh);
    const rctx = result.getContext('2d');
    rctx.drawImage(sourceCanvas, 0, 0);
    const imgData = rctx.getImageData(0, 0, sw, sh);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) {
        d[i] = r;
        d[i + 1] = g;
        d[i + 2] = b;
      }
    }
    rctx.putImageData(imgData, 0, 0);
    return result;
  }

  // Save Marks
  const markDark = colorize(markTight, 37, 39, 31); // #25271F
  const markLight = colorize(markTight, 238, 233, 191); // #EEE9BF Morning Dew
  const markOlive = colorize(markTight, 121, 134, 75); // #79864B Olive Grove
  const markBronze = colorize(markTight, 138, 125, 76); // #8A7D4C Warm Bronze

  fs.writeFileSync('public/images/logo/knowza-mark-dark.png', markDark.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-mark-light.png', markLight.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-mark-olive.png', markOlive.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-mark-bronze.png', markBronze.toBuffer('image/png'));

  // Save Wordmarks
  const wordDark = colorize(wordTight, 37, 39, 31);
  const wordLight = colorize(wordTight, 238, 233, 191);
  fs.writeFileSync('public/images/logo/knowza-wordmark-dark.png', wordDark.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-wordmark-light.png', wordLight.toBuffer('image/png'));

  // 3. Create Horizontal Lockups (Height: 64px, Mark on Left, Wordmark on Right)
  function createHorizontal(isLight) {
    const targetH = 80;
    const mScale = targetH / markH;
    const scaledMW = Math.round(markW * mScale);
    
    // Scale wordmark proportionally
    const wScale = (targetH * 0.46) / wordH;
    const scaledWW = Math.round(wordW * wScale);
    const scaledWH = Math.round(wordH * wScale);
    
    const spacing = 20;
    const totalW = scaledMW + spacing + scaledWW;
    
    const hCanvas = createCanvas(totalW + 20, targetH + 10);
    const hCtx = hCanvas.getContext('2d');
    
    const useMark = isLight ? markLight : markDark;
    const useWord = isLight ? wordLight : wordDark;
    
    // Draw mark
    hCtx.drawImage(useMark, 10, 5, scaledMW, targetH);
    // Draw wordmark centered vertically
    const wY = 5 + Math.round((targetH - scaledWH) / 2);
    hCtx.drawImage(useWord, 10 + scaledMW + spacing, wY, scaledWW, scaledWH);
    
    return hCanvas;
  }

  const horizDark = createHorizontal(false);
  const horizLight = createHorizontal(true);
  fs.writeFileSync('public/images/logo/knowza-logo-horizontal-dark.png', horizDark.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-logo-horizontal-light.png', horizLight.toBuffer('image/png'));

  // 4. Create Favicon (Green circle with morning dew mark matching slide 17)
  const favCanvas = createCanvas(128, 128);
  const favCtx = favCanvas.getContext('2d');
  favCtx.fillStyle = '#79864B'; // Olive Grove
  favCtx.beginPath();
  favCtx.arc(64, 64, 62, 0, Math.PI * 2);
  favCtx.fill();

  // Draw mark in center
  const favMarkH = 80;
  const favScale = favMarkH / markH;
  const favMarkW = Math.round(markW * favScale);
  const favX = Math.round((128 - favMarkW) / 2);
  const favY = Math.round((128 - favMarkH) / 2);
  favCtx.drawImage(markLight, favX, favY, favMarkW, favMarkH);

  fs.writeFileSync('public/favicon.png', favCanvas.toBuffer('image/png'));
  fs.writeFileSync('public/apple-touch-icon.png', favCanvas.toBuffer('image/png'));

  console.log('Successfully generated all logo variations and favicons!');
}

generateAll().catch(console.error);
