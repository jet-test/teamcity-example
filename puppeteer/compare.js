const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const {buffer, diffDir, stable} = require('./paths');
const {readBufferedFiles} = require("./utils")

async function compareImages(filename, flowId) {
    let generatedFile = null
    let originalFile = null
    let testName = escapeTCMessage(`compare-${filename.replace(/\./g, "_")}`);
    console.log(`##teamcity[testStarted name='${testName}' flowId='${flowId}']`)
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
            await fs.promises.writeFile(`${diffDir}/${filename}`, PNG.sync.write(diff))
            console.log(`##teamcity[publishArtifacts '${buffer}/${filename} => .teamcity/puppeteer/actual']`)
            console.log(`##teamcity[testMetadata testName='${testName}' type='artifact' value='.teamcity/puppeteer/actual/${filename}' name='actual.image']`)
            console.log(`##teamcity[publishArtifacts '${stable}/${filename} => .teamcity/puppeteer/expected']`)
            console.log(`##teamcity[testMetadata testName='${testName}' type='artifact' value='.teamcity/puppeteer/expected/${filename}' name='expected.image']`)
            console.log(`##teamcity[publishArtifacts '${diffDir}/${filename} => .teamcity/puppeteer/diff']`)
            console.log(`##teamcity[testMetadata testName='${testName}' type='artifact' value='.teamcity/puppeteer/diff/${filename}' name='diff.image']`)
            console.log(`##teamcity[testFailed name='${testName}' message='ERROR' flowId='${flowId}']`)
        }
    } catch (error) {
        console.trace("Error: ", error)
        console.log(`##teamcity[testFailed name='${testName}' message='Error: ${error.code}' details='${escapeTCMessage(error.toString())}' flowId='${flowId}']`)

        if (error.code === "ENOENT") {
            await fs.promises.writeFile(`${diffDir}/${filename}`, generatedFile)
        }
    } finally {
        let duration = Date.now() - startTime
        console.log(`##teamcity[testFinished name='${testName}' duration='${duration}' flowId='${flowId}']`)
    }
}

function escapeTCMessage(str) {
    return str.replace(/\|/g, "||")
        .replace(/\n/g, "|n")
        .replace(/\r/g, "|r")
        .replace(/\[/g, "|[")
        .replace(/]/g, "|]")
        .replace(/'/g, "|'")
}

async function launchCompare() {
    const files = await readBufferedFiles()

    const flowId = Date.now()
    console.log(`##teamcity[testSuiteStarted name='compare images' flowId='${flowId}']`)
    for (const filename of files) {
        await compareImages(filename, flowId)
        console.log("File: ", filename)
    }
    console.log(`##teamcity[testSuiteFinished name='compare images' flowId='${flowId}']`)
}
launchCompare()

console.log("Compared")
