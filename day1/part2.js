const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/, as: Number})

const windows = data.map(
    (depth, i) => i < data.length - 2 ? depth + data[i+1]+ data[i+2] : 0
).slice(0, -2)

const numIncreases = windows.reduce(
    (total, window, i) => total += i && window > windows[i -1] ? 1 : 0,
    0
)

console.log(numIncreases)