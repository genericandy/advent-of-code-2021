const { create } = require('domain')
const loadFile = require('../utils/loadFile')
const src = './sampledata.txt'
// const src = './data.txt'
const data = loadFile(src)

console.log(data)