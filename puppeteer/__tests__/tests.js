describe('Input click', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8041');
    });

    it('should be titled "PHP Test"', async () => {
        await expect(page.title()).resolves.toMatch('PHP Test');
    });

    it('send correct form data', async () => {
        const name = "Johny"
        await expect(page).toFillForm('#form', {name})
        page.click("input[type=submit]")
        await page.waitForNavigation({waitUntil: 'networkidle0'})
        await expect(page).toMatchElement("span#name")
        await expect(page).toMatch(`Hello ${name}`)
    });
});
