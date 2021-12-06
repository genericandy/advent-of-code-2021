const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/, as: Number})

const numIncreases = data.reduce(
    (total, depth, i) => total += i && depth > data[i -1] ? 1 : 0,
    0
)

console.log(numIncreases)