const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const terser = require('terser');
async function build() {
  fs.mkdirSync('assets/vendor', { recursive: true });
  fs.mkdirSync('assets/fonts/files', { recursive: true });
  for (const name of ['react', 'react-dom']) {
    fs.copyFileSync(`node_modules/${name}/umd/${name}.production.min.js`, `assets/vendor/${name}-18.3.1.min.js`);
    fs.copyFileSync(`node_modules/${name}/LICENSE`, `assets/vendor/${name}.LICENSE`);
  }
  for (const name of ['aroma', 'enneagram']) {
    const result = await terser.minify(fs.readFileSync(`scripts/source/${name}.js`, 'utf8'), {
      compress: true, mangle: { toplevel: true }, format: { ascii_only: true, comments: false }
    });
    fs.writeFileSync(`assets/${name}.min.js`, result.code + '\n');
    if (name === 'enneagram') {
      const version = crypto.createHash('sha256').update(result.code + '\n').digest('hex').slice(0, 16);
      const html = fs.readFileSync('Enneagram', 'utf8');
      fs.writeFileSync('Enneagram', html.replace(/\.\/assets\/enneagram\.min\.js(?:\?v=[a-f0-9]+)?/g,
        `./assets/enneagram.min.js?v=${version}`));
    }
  }
  const families = {
    'noto-serif-tc': ['300','400','500','600','700'],
    cinzel: ['400','600','700'],
    'cinzel-decorative': ['400','700'],
    'cormorant-garamond': ['400','600','400-italic']
  };
  let css = '';
  for (const [family, styles] of Object.entries(families)) {
    const root = `node_modules/@fontsource/${family}`;
    fs.copyFileSync(`${root}/LICENSE`, `assets/fonts/${family}.LICENSE`);
    for (const style of styles) {
      let sheet = fs.readFileSync(`${root}/${style}.css`, 'utf8');
      // Modern browsers use WOFF2; avoid shipping duplicate WOFF fallbacks.
      sheet = sheet.replace(/, url\([^)]*\.woff\) format\('woff'\)/g, '');
      for (const match of sheet.matchAll(/url\(\.\/files\/([^)]*)\)/g)) {
        fs.copyFileSync(`${root}/files/${match[1]}`, `assets/fonts/files/${match[1]}`);
      }
      css += sheet + '\n';
    }
  }
  fs.writeFileSync('assets/fonts/fonts.css', css);
  const vendor = fs.readdirSync('assets/vendor').filter(n => n.endsWith('.js'));
  const manifest = Object.fromEntries(vendor.sort().map(name => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join('assets/vendor',name))).digest('hex')]));
  fs.writeFileSync('assets/vendor/SHA256SUMS.json', JSON.stringify(manifest,null,2)+'\n');
}
build().catch(error => { console.error(error); process.exit(1); });
