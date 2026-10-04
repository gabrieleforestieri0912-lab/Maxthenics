const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const problems = [];
  page.on('pageerror', (e) => problems.push('PAGEERROR: ' + e.message));

  // gradient CTA present on programs + login + room
  for (const url of ['http://localhost:3100/programs', 'http://localhost:3100/login', 'http://localhost:3100/calisthenics-room']) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    const grad = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('button, a'));
      return els.filter((e) => {
        const bg = window.getComputedStyle(e).backgroundImage;
        return bg && bg.includes('linear-gradient') && bg.includes('220, 38, 38');
      }).length;
    });
    console.log(url, '| gradient CTAs:', grad);
  }
  // no full-screen spinner on dashboard/my-program (logged out -> content, not spinner)
  await page.goto('http://localhost:3100/my-program', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const body = await page.evaluate(() => document.body.innerText.slice(0, 200));
  console.log('my-program shows content (not blank spinner):', body.length > 50);
  console.log('PROBLEMS:', problems.length ? problems : 'none');
  await browser.close();
})().catch((e) => { console.error('SCRIPT-FAIL:', e.message); process.exit(1); });
