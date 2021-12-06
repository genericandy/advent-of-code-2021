const loadFile = require('../utils/loadFile')
const src = './sampledata.txt'
// const src = './data.txt'
let data = loadFile(src, { split: ',', as: Number })

function tick() {
    const newData = []
    data.forEach(n => {
        if (n === 0) {
            newData.push(6)
            newData.push(8)
        } else {
            newData.push(n - 1)
        }
    });

    data = newData
}

for (i = 0; i < 80; i++) {
    tick()
}

console.log(data.length)