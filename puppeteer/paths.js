const path = require('path')

const buffer = path.join(__dirname, 'buffer')
const stable = path.join(__dirname, 'stable')
const diffDir = path.join(__dirname, 'diff')

module.exports = {
    buffer,
    stable,
    diffDir,
}
