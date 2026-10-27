const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function main() {
  const destDir = 'C:\\Users\\HP\\Downloads\\paypal';
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1500,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. API Inspector drawer open
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text && text.includes('API Inspector')) {
        await btn.click();
        console.log('Clicked API Inspector...');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(destDir, '04-paypal-api-inspector-drawer.png') });
    console.log('Saved 04-paypal-api-inspector-drawer.png');
  } catch (e) {
    console.error('Inspector error:', e.message);
  }

  // 2. Fullwidth table with copilot collapsed
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      const title = await page.evaluate(el => el.getAttribute('title') || '', btn);
      if (text.includes('Collapse') || title.includes('Collapse')) {
        await btn.click();
        console.log('Clicked Collapse Copilot...');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(destDir, '05-fullwidth-aggrid-workbench.png') });
    console.log('Saved 05-fullwidth-aggrid-workbench.png');
  } catch (e) {
    console.error('Fullwidth table error:', e.message);
  }

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
