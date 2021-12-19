const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const grid = data.map( (row, y) => row.split('').map((n, x) => ({ n: +n, x, y, flashed: false })))
const flatGrid = grid.flat()
let numSteps = 0

function flashPoint( point ) {
    point.flashed = true
    const {x, y} = point
    const neighbors = new Array(
        grid[y-1] && grid[y-1][x-1],
        grid[y-1] && grid[y-1][x],
        grid[y-1] && grid[y-1][x+1],
        grid[y][x-1],
        grid[y][x],
        grid[y][x+1],
        grid[y+1] && grid[y+1][x-1],
        grid[y+1] && grid[y+1][x],
        grid[y+1] && grid[y+1][x+1]
    )
    neighbors.forEach(point => {
        if (point) {
            point.n++
        }
    })
}

function takeStep() {
    flatGrid.forEach( point => {
        point.n++
        point.flashed = false
    })
    let flashers
    do {
        flashers = flatGrid.filter(point => point.n > 9 && !point.flashed)
        flashers.forEach(flashPoint)
    } while (flashers.length)
    flatGrid.forEach(point => { if (point.n > 9) point.n = 0 })
}

while(flatGrid.filter(({ n }) => n).length) {
    takeStep()
    numSteps++
}

console.log(numSteps)