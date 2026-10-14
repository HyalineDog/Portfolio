// Frames 16:10 screenshots in a laptop and saves them as transparent PNGs.
// Usage: node render.cjs <shots-dir> <out-dir> shot.png="Output Name" [...]
// Needs Playwright (`npm i -D playwright` anywhere on the module path).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const [, , shotsDir, outDir, ...pairs] = process.argv;
if (!shotsDir || !outDir || pairs.length === 0) {
  console.error('Usage: node render.cjs <shots-dir> <out-dir> shot.png="Output Name" [...]');
  process.exit(1);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1.25 });
  await page.goto('file://' + path.join(__dirname, 'laptop.html'));
  for (const pair of pairs) {
    const [src, name] = pair.split('=');
    const data = fs.readFileSync(path.resolve(shotsDir, src)).toString('base64');
    await page.evaluate(uri => new Promise(resolve => {
      const img = document.getElementById('img');
      img.onload = resolve;
      img.src = uri;
    }), `data:image/png;base64,${data}`);
    await page.locator('#w').screenshot({ path: path.resolve(outDir, `${name}.png`), omitBackground: true });
    console.log('framed', src, '->', `${name}.png`);
  }
  await browser.close();
})();
