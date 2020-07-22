const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const {buffer, diffDir, stable} = require('./paths');
const {readBufferedFiles} = require("./utils")

async function compareImages(filename) {
    let generatedFile = null
    let originalFile = null
    let testName = "compare-" + filename;
    console.log("##teamcity[testStarted name='" + testName + "']")
    let startTime = Date.now()
    try {
        generatedFile = await fs.promises.readFile(`${buffer}/${filename}`)
        originalFile = await fs.promises.readFile(`${stable}/${filename}`)

        const generated = PNG.sync.read(generatedFile)
        const original = PNG.sync.read(originalFile)

        const {width, height} = original
        const diff = new PNG({width, height})

        const diffCount = pixelmatch(original.data, generated.data, diff.data, width, height, {threshold: 0.2})

        if (diffCount > 0) {
            console.log("##testFailed[testStarted name='" + testName + "' message='ERROR']")
            await fs.promises.writeFile(`${diffDir}/${filename}`, PNG.sync.write(diff))
        } else {

        }
    } catch (error) {
        console.trace("Error: ", error)
        console.log("##testFailed[testStarted name='" + testName + "' message='NEW IMAGE' details='" + error.toString().replace("\\", "|").replace("'", "|'") + "']")

        if (error.code === "ENOENT") {
            await fs.promises.writeFile(`${diffDir}/${filename}`, generatedFile)
        }
    } finally {
        console.log("##testFinished[testStarted name='" + testName + "' duration='" + Date.now() - startTime + "']")
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
