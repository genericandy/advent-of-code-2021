const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const segments = [2,4,3,7]

total = data
    .map( str => str.split('| ')[1] )
    .map( str => str.match(/\w+/g) )
    .flat()
    .filter( str => segments.includes(str.length) )

console.log(total.length)