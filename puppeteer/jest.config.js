module.exports = {
    "preset": "jest-puppeteer",
    "reporters": ["default", "jest-teamcity"],
    launch: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
}
