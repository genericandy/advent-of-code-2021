const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
let data = loadFile(src, { split: ',', as: Number })
const days = 8

let fish = new Map()
for (let i = 0; i <= days; i++) {
    fish.set(i, 0)
}
data.forEach(n => {
    fish.set(n, fish.get(n) + 1)
})

function tick() {
    const newFish = new Map()
    for (let i = 0; i <= days; i++) {
        if (i === 6) {
            newFish.set(6, fish.get(0) + fish.get(7))
        } else if (i === 8) {
            newFish.set(8, fish.get(0))
        } else {
            newFish.set(i, fish.get(i + 1))
        }
    }
    fish = newFish
}

for (let i = 0; i < 256; i++) {
    tick()
}

const sum = [...fish.values()].reduce((t,n) => t + n, 0)
console.log(sum)