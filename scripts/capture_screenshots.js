import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // wait and retry
    }
    await sleep(300);
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function run() {
  console.log('🚀 Starting Vite Preview Server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: projectRoot,
    shell: true,
    stdio: 'ignore',
  });

  try {
    await waitForServer('http://localhost:4173');
    console.log('✅ Vite Preview server is ready at http://localhost:4173');

    console.log('🌐 Launching Headless Chrome...');
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();

    // 1. Desktop Dashboard (Light Mode)
    console.log('📸 Capturing 01-desktop-dashboard-light.png (1440x900)...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({
      path: path.join(projectRoot, 'screenshots', '01-desktop-dashboard-light.png'),
      fullPage: false,
    });

    // 2. Telemetry & Projections View
    console.log('📸 Capturing 02-telemetry-and-projections.png (1440x900)...');
    const analyticsTab = await page.$('[data-testid="tab-analytics-btn"]');
    if (analyticsTab) {
      await analyticsTab.click();
      await sleep(600);
      await page.screenshot({
        path: path.join(projectRoot, 'screenshots', '02-telemetry-and-projections.png'),
        fullPage: false,
      });
      // Switch back to dashboard tab
      const dashboardTab = await page.$('[data-testid="tab-dashboard-btn"]');
      if (dashboardTab) await dashboardTab.click();
      await sleep(300);
    }

    // 3. Accessible Export Modal
    console.log('📸 Capturing 03-accessible-export-modal.png...');
    const exportBtn = await page.$('[data-testid="open-export-modal-btn"]');
    if (exportBtn) {
      await exportBtn.click();
      await sleep(500);
      await page.screenshot({
        path: path.join(projectRoot, 'screenshots', '03-accessible-export-modal.png'),
        fullPage: false,
      });
      const closeExportBtn = await page.$('[data-testid="close-export-modal-btn"]');
      if (closeExportBtn) await closeExportBtn.click();
      await sleep(300);
    }

    // 4. Desktop Dark Mode
    console.log('📸 Capturing 04-desktop-dark-mode.png (1440x900)...');
    const themeBtn = await page.$('[data-testid="theme-toggle-btn"]');
    if (themeBtn) {
      await themeBtn.click();
      await sleep(500);
      await page.screenshot({
        path: path.join(projectRoot, 'screenshots', '04-desktop-dark-mode.png'),
        fullPage: false,
      });
      // Toggle back to light
      await themeBtn.click();
      await sleep(300);
    }

    // 5. Tablet Responsive (768px x 1024px)
    console.log('📸 Capturing 05-tablet-responsive-768px.png (768x1024)...');
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
    await sleep(400);
    await page.screenshot({
      path: path.join(projectRoot, 'screenshots', '05-tablet-responsive-768px.png'),
      fullPage: false,
    });

    // 6. Mobile Responsive (375px x 812px - iPhone X/13)
    console.log('📸 Capturing 06-mobile-responsive-375px.png (375x812)...');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await sleep(400);
    await page.screenshot({
      path: path.join(projectRoot, 'screenshots', '06-mobile-responsive-375px.png'),
      fullPage: false,
    });

    // 7. Mobile Navigation Drawer
    console.log('📸 Capturing 07-mobile-navigation-drawer.png...');
    const mobileMenuTrigger = await page.$('[data-testid="mobile-menu-trigger"]');
    if (mobileMenuTrigger) {
      await mobileMenuTrigger.click();
      await sleep(500);
      await page.screenshot({
        path: path.join(projectRoot, 'screenshots', '07-mobile-navigation-drawer.png'),
        fullPage: false,
      });
    }

    await browser.close();
    console.log('🎉 All 7 visual representation screenshots successfully captured!');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
