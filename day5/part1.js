const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })

const lines = data.map( line => {
   const [ x1, y1, x2, y2 ] = line.match(/\d+/g).map(Number)
   return {
       x1, x2, y1, y2,
       xD: Math.min(1, Math.max(-1, x2 - x1)),
       yD: Math.min(1, Math.max(-1, y2 - y1))
   }
}).filter( line => line.x1 === line.x2 || line.y1 === line.y2 )

const maxX = lines.reduce((max, line) => Math.max(max, line.x1, line.x2 ), 0)
const maxY = lines.reduce((max, line) => Math.max(max, line.y1, line.y2 ), 0)
const col = new Array(maxY + 1).fill(0)
const map = []
for (i = 0; i < maxX + 1; i++) {
    map.push([...col])
}

lines.forEach( ({xD, yD, x1, y1, x2, y2 }) => {
    while (x1 !== x2 || y1 !== y2) {
        map[x1][y1]++
        x1 += xD
        y1 += yD
    }
    map[x2][y2]++
})

console.log(map.flat().filter(n => n >= 2).length)