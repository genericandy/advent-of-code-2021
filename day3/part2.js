const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })

function reduceBy(arr, moreLess, pos = 0) {
    const half = arr.length / 2
    const sum = arr.reduce( (total, row) => total + +row[pos], 0 )
    let filter
    if (moreLess) {
        filter = sum >= half ? 1 : 0
    } else {
        filter = sum < half ? 1 : 0
    }
    const filteredArr = arr.filter(row => row[pos] === `${filter}`)
    return filteredArr.length > 1 ? reduceBy(filteredArr, moreLess, pos + 1) : parseInt(filteredArr[0], 2)
}

const oxygen = reduceBy(data, true)
const co2 = reduceBy(data, false)

console.log(oxygen * co2)