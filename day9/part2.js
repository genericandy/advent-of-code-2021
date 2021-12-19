const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const map = data.map( str => str.split('').map(Number)

function getNeighbors(x, y) {
    const neighbors = [
        { x: x-1, y, val: map[y][x-1] },
        { x: x+1, y, val: map[y][x+1] },
        { x, y: y-1, val: map[y-1] && map[y-1][x] },
        { x, y: y+1, val: map[y+1] && map[y+1][x] }
    ]
    return neighbors.filter( ({ val }) => !isNaN(val))
}

function findLows() {
    const points = []
    map.forEach( (row, y) => {
        row.forEach( (point, x) => {
            const neighbors = getNeighbors(x, y).filter( ({ val }) => val <= point)
            if (!neighbors.length) points.push({x, y, val: point})
        })
    })
    return points
}

function findBasinNeighbors({ x, y }, set) {
    set.add(`${x}-${y}`)
    map[y][x] = -1
    getNeighbors(x, y)
        .filter( ({ val }) => val !== 9 && val !== -1)
        .forEach(neighbor => findBasinNeighbors(neighbor, set))
    return set
}

function getAllBasins() {
    return findLows()
        .map(point => findBasinNeighbors(point, new Set()).size)
        .sort((a,b) => a - b)
        .slice(-3)
        .reduce((prod, n) => n * prod, 1)
}

console.log(getAllBasins())