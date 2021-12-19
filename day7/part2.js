const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: ',', as: Number })
const savedFuel = new Map()
savedFuel.set(0, 0)

function calcFuel(n) {
    if (savedFuel.has(n)) {
        return savedFuel.get(n)
    }
    const fuel = n + calcFuel(n - 1)
    savedFuel.set(n, fuel)
    return fuel
}

const min = Math.min(...data)
const max = Math.max(...data)
const totalFuels = []

for (let i = min; i<=max; i++) {
    totalFuels.push(
        data.reduce( (sum, n) => sum + calcFuel( Math.abs(i - n), 0))
    )
}

console.log(Math.min(...totalFuels))
