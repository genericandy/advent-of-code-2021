const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const map = data.map( str => str.split('').map(Number))

function getNeighbors(x, y) {
    const neighbors = [
        map[y][x-1],
        map[y][x+1],
        map[y-1] && map[y-1][x],
        map[y+1] && map[y+1][x]
    ]
    return neighbors.filter( n => !isNaN(n))
}

function findLows() {
    return map.reduce( (total, row, y) => 
            row.reduce( (rowTotal, point, x) => {
                const neighbors = getNeighbors(x, y).filter( n => n <= point)
                return neighbors.length ? rowTotal : rowTotal + point + 1
            }, total
        ), 0
    )
}


console.log(findLows())