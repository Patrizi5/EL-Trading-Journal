const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function runAxe() {
  const srcPath = path.join(process.cwd(), 'index.html');
  if (!fs.existsSync(srcPath)) {
    console.error('index.html not found.');
    process.exit(2);
  }

  const html = fs.readFileSync(srcPath, 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;

  const axePath = require.resolve('axe-core/axe.min.js');
  const axeScript = fs.readFileSync(axePath, 'utf8');
  window.eval(axeScript);

  await new Promise(r => setTimeout(r, 50));

  try {
    const results = await window.axe.run();
    const outPath = path.join(process.cwd(), 'axe-results-source.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('Axe results written to', outPath);
    process.exit(0);
  } catch (err) {
    console.error('axe.run failed:', err);
    process.exit(1);
  }
}

runAxe();
