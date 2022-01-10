const { create } = require('domain')
const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src)

const [,,yMin,] = data.match(/-*\d+/g).map(Number)
const yVMax = -(yMin + 1)

let y = 0
let topY = 0
let yV = yVMax

while (y >= topY) {
    topY = y
    y += yV
    yV--
}

console.log(topY)