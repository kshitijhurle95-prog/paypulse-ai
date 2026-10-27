const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

async function main() {
  const destDir = 'C:\\Users\\HP\\Downloads\\paypal';
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 1. Copy existing verified high-res screenshots with clean numbered names
  const existingMap = [
    { src: 'hero-preview.png', dst: '01-main-dashboard.png' },
    { src: 'feature-interaction.png', dst: '02-copilot-approval-card.png' },
    { src: 'dark-mode-preview.png', dst: '03-dark-mode-view.png' },
  ];

  const screenshotsDir = path.join(__dirname, '..', 'assets', 'screenshots');
  for (const item of existingMap) {
    const sPath = path.join(screenshotsDir, item.src);
    if (fs.existsSync(sPath)) {
      fs.copyFileSync(sPath, path.join(destDir, item.dst));
      console.log(`Copied ${item.src} -> ${item.dst}`);
    }
  }

  // Start Next.js server
  console.log('Starting Next.js server on port 3000...');
  const server = spawn('npm.cmd', ['run', 'start', '--', '-p', '3000'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore'
  });

  // Wait 4 seconds for server to be ready
  await new Promise(r => setTimeout(r, 4000));

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1500,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000 }); // Perfect 3:2 ratio (1500x1000)

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. 3:2 Thumbnail for Step 2
  await page.screenshot({ path: path.join(destDir, '00-project-thumbnail-3x2.png') });
  console.log('Captured 00-project-thumbnail-3x2.png');

  // 2. Open API Inspector drawer to showcase PayPal REST API telemetry
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
    console.log('Captured 04-paypal-api-inspector-drawer.png');
  } catch (e) {
    console.error('Inspector capture error:', e.message);
  }

  // 3. Collapse AI Copilot to showcase Full-Width AG Grid table view
  try {
    // reload fresh
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
    console.log('Captured 05-fullwidth-aggrid-workbench.png');
  } catch (e) {
    console.error('Fullwidth table capture error:', e.message);
  }

  await browser.close();
  try {
    process.kill(server.pid);
  } catch {}
  console.log('Gallery generation complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
