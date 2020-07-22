const puppeteer = require('puppeteer');
const {cleanDirectory} = require('./utils');
const {buffer, diffDir} = require('./paths');

(async () => {
    await cleanDirectory(buffer)
    await cleanDirectory(diffDir)

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8041');
    await page.screenshot({path: `buffer/overview.png`});

    await browser.close();
})();
