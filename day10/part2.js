const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const regPairs = /\[\]|\(\)|\{\}|\<\>/g
const corruptReg = /[\)\}\]\>]/
const vals = { '(': 1, '[': 2, '{': 3, '<': 4 }

function removePairs(str) {
    let lastStr
    do {
        lastStr = str
        str = str.replace(regPairs, '')
    } while (lastStr !== str)
    return str
}

function removeCorruptLines(str) {
    return str.search(corruptReg) === -1
}

function getLineScore(str) {
    return str.split('')
              .reverse()
              .reduce((total, char) => total * 5 + vals[char], 0)
}

const scores = data.map(removePairs)
                   .filter(removeCorruptLines)
                   .map(getLineScore)
                   .sort((a,b) => a - b)

console.log(scores[scores.length / 2 | 0 ])