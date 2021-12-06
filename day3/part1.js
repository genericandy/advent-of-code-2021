const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })

const bits = new Array(data[0].length).fill(0)

data.forEach( row => {
    [...row].forEach(
        (ltr, i) => {
            bits[i] += +ltr
        }
    )
})

const half = data.length / 2
const gamma = parseInt(bits.map( n => n > half ? 1 : 0).join(''), 2)
const epsilon =  parseInt(bits.map( n => n > half ? 0 : 1).join(''), 2)

console.log(gamma * epsilon)