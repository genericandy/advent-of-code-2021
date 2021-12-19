const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const regPairs = /\[\]|\(\)|\{\}|\<\>/g
const corruptReg = /[\)\}\]\>]/
const vals = { '-1': 0, ')': 3, ']': 57, '}': 1197, '>': 25137 }

function removePairs(str) {
    let lastStr
    do {
        lastStr = str
        str = str.replace(regPairs, '')
    } while (lastStr !== str)
    return str
}

function getCorruptCharVal(total, str) {
    const char = str.search(corruptReg)
    return total + vals[str[char] || char]
}

const corrupted = data.map(removePairs)
                      .reduce(getCorruptCharVal, 0)
console.log(corrupted)
