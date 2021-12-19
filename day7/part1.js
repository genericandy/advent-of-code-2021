const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: ',', as: Number })

const min = Math.min(...data)
const max = Math.max(...data)
const totalFuels = []

for (let i = min; i<=max; i++) {
    totalFuels.push(
        data.reduce( (sum, n) => sum + Math.abs(i - n), 0)
    )
}

console.log(Math.min(...totalFuels))