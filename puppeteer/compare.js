const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const {buffer, diffDir, stable} = require('./paths');
const {readBufferedFiles} = require("./utils")

async function compareImages(filename) {
    let generatedFile = null
    let originalFile = null
    try {
        generatedFile = await fs.promises.readFile(`${buffer}/${filename}`)
        originalFile = await fs.promises.readFile(`${stable}/${filename}`)

        const generated = PNG.sync.read(generatedFile)
        const original = PNG.sync.read(originalFile)

        const {width, height} = original
        const diff = new PNG({width, height})

        const diffCount = pixelmatch(original.data, generated.data, diff.data, width, height, {threshold: 0.2})

        if (diffCount > 0) {
            await fs.promises.writeFile(`${diffDir}/${filename}`, PNG.sync.write(diff))
        }
    } catch (error) {
        console.error("Error: ", error)

        if (error.code === "ENOENT") {
            await fs.promises.writeFile(`${diffDir}/${filename}`, generatedFile)
        }
    }
}

async function launchCompare() {
    const files = await readBufferedFiles()

    for (const filename of files) {
        await compareImages(filename)
        console.log("File: ", filename)
    }
}
launchCompare()

console.log("Compared")
