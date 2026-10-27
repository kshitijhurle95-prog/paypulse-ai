const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const screenshotsDir = path.join(__dirname, '..', 'assets', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture hero-preview
  const heroPath = path.join(screenshotsDir, 'hero-preview.png');
  await page.screenshot({ path: heroPath, fullPage: false });
  console.log('Captured hero-preview.png at', heroPath);

  // 2. Click quick prompt for feature interaction
  try {
    const buttons = await page.$$('button');
    let clicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text && text.includes('Bill sarah@test.com')) {
        console.log('Clicking quick action: Bill sarah@test.com...');
        await btn.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      // try typing into textarea
      const input = await page.$('textarea');
      if (input) {
        await input.type('Bill sarah@test.com $75 for cupcakes');
        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) await submitBtn.click();
      }
    }
    // Wait for response card to render
    await new Promise(r => setTimeout(r, 4000));
    const interactionPath = path.join(screenshotsDir, 'feature-interaction.png');
    await page.screenshot({ path: interactionPath, fullPage: false });
    console.log('Captured feature-interaction.png at', interactionPath);
  } catch (err) {
    console.error('Error during feature interaction:', err.message);
  }

  // 3. Dark mode preview
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text && text.includes('Dark Mode')) {
        console.log('Clicking Dark Mode toggle...');
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    const darkPath = path.join(screenshotsDir, 'dark-mode-preview.png');
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log('Captured dark-mode-preview.png at', darkPath);
  } catch (err) {
    console.error('Error during dark mode capture:', err.message);
  }

  await browser.close();
  console.log('Screenshot capture routine completed successfully!');
}

run().catch(err => {
  console.error('Fatal script error:', err);
  process.exit(1);
});
