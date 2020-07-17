const fs = require('fs')
const {buffer} = require('./paths');

async function readBufferedFiles() {
    console.log("Retrieve buffered images.")
    const files = await fs.promises.readdir(buffer)
    return files.filter(filename => filename !== '.gitkeep')
}

async function cleanDirectory(dirPath) {
    const files = (await fs.promises.readdir(dirPath)).filter(filename => filename !== '.gitkeep')
    files.forEach(async filename => await fs.promises.unlink(`${dirPath}/${filename}`))
    console.log(`Erasing images at ${dirPath} completed.`)
}

module.exports = {
    readBufferedFiles,
    cleanDirectory,
}
