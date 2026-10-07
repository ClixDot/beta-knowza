const fs = require('fs');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

async function extract() {
  const img = await loadImage('pdf_pages/page_2.png');
  const w = img.width;
  const h = img.height;
  console.log('Page 2 dimensions:', w, h);

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Background color is approximately r: 121, g: 134, b: 75
  // Logo text & mark is Morning dew: r: 238, g: 233, b: 191
  // Let's find pixels where brightness is significantly higher than background
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let logoPixels = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // If color is Morning Dew (r > 180, g > 180, b > 140)
      if (r > 180 && g > 180 && b > 140) {
        logoPixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Logo pixels:', logoPixels);
  console.log('Bounding box:', { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY });

  // Now create an isolated transparent logo
  const pad = 60;
  const logoW = maxX - minX + 1;
  const logoH = maxY - minY + 1;

  // 1. Transparent with light color (Morning Dew #EEE9BF)
  const lightCanvas = createCanvas(logoW + pad * 2, logoH + pad * 2);
  const lctx = lightCanvas.getContext('2d');
  const lImgData = lctx.createImageData(logoW + pad * 2, logoH + pad * 2);

  // 2. Transparent with dark color (Forest Shadow #28351F / #25271F)
  const darkCanvas = createCanvas(logoW + pad * 2, logoH + pad * 2);
  const dctx = darkCanvas.getContext('2d');
  const dImgData = dctx.createImageData(logoW + pad * 2, logoH + pad * 2);

  // 3. Transparent with Olive Grove (#79864B)
  const oliveCanvas = createCanvas(logoW + pad * 2, logoH + pad * 2);
  const octx = oliveCanvas.getContext('2d');
  const oImgData = octx.createImageData(logoW + pad * 2, logoH + pad * 2);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const srcIdx = (y * w + x) * 4;
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      // Measure closeness to Morning Dew vs Background
      // Background ~ (121, 134, 75), Morning Dew ~ (238, 233, 191)
      const bgDist = Math.sqrt((r-121)**2 + (g-134)**2 + (b-75)**2);
      const fgDist = Math.sqrt((r-238)**2 + (g-233)**2 + (b-191)**2);
      
      const total = bgDist + fgDist;
      let alpha = total > 0 ? (bgDist / total) : 0;
      // Contrast stretch
      alpha = Math.max(0, Math.min(1, (alpha - 0.25) / 0.5));

      const destX = (x - minX) + pad;
      const destY = (y - minY) + pad;
      const destIdx = (destY * (logoW + pad * 2) + destX) * 4;

      if (alpha > 0.05) {
        // Light logo (#EEE9BF)
        lImgData.data[destIdx] = 238;
        lImgData.data[destIdx + 1] = 233;
        lImgData.data[destIdx + 2] = 191;
        lImgData.data[destIdx + 3] = Math.round(alpha * 255);

        // Dark logo (#25271F)
        dImgData.data[destIdx] = 37;
        dImgData.data[destIdx + 1] = 39;
        dImgData.data[destIdx + 2] = 31;
        dImgData.data[destIdx + 3] = Math.round(alpha * 255);

        // Olive logo (#79864B)
        oImgData.data[destIdx] = 121;
        oImgData.data[destIdx + 1] = 134;
        oImgData.data[destIdx + 2] = 75;
        oImgData.data[destIdx + 3] = Math.round(alpha * 255);
      }
    }
  }

  lctx.putImageData(lImgData, 0, 0);
  dctx.putImageData(dImgData, 0, 0);
  octx.putImageData(oImgData, 0, 0);

  if (!fs.existsSync('public')) fs.mkdirSync('public');
  if (!fs.existsSync('public/images')) fs.mkdirSync('public/images');
  if (!fs.existsSync('public/images/logo')) fs.mkdirSync('public/images/logo');

  fs.writeFileSync('public/images/logo/knowza-logo-light.png', lightCanvas.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-logo-dark.png', darkCanvas.toBuffer('image/png'));
  fs.writeFileSync('public/images/logo/knowza-logo-olive.png', oliveCanvas.toBuffer('image/png'));

  console.log('Successfully saved official logos in public/images/logo!');
}

extract().catch(console.error);
