const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n\r\n/ })

function parseDataPoints () {
   return data[0]
        .split(/\r\n/)
        .map(str => str.split(',').map(Number))
        .map(([x,y]) => ({ x, y }))
}

function parseInstructions() {
    return data[1]
        .split(/\r\n/)
        .map( str => ({
            dir: (/x|y/).exec(str)[0],
            val: +(/\d+/).exec(str)[0]
        }))
}

function fold({ dir, val}, points) {
    const pointMap = new Map()
    points.forEach(point => {
        const newPoint = { ...point}
        if (point[dir] > val) {
            newPoint[dir] = 2 * val - point[dir]
        }
        pointMap.set(JSON.stringify(newPoint), newPoint)
    })
    return [...pointMap.values()]
}

function draw(points) {
    const maxX = Math.max(...points.map(({ x }) => x))
    const maxY = Math.max(...points.map(({ y }) => y))
    const grid = []
    for (y = 0; y <= maxY; y++) {
        grid[y] = new Array(maxX).fill(' ')
    }
    points.forEach(({x, y}) => grid[y][x] = '#')
    grid.forEach(arr => console.log(arr.join('')))
}

const instructions = parseInstructions()
const foldedPoints = instructions.reduce( (points, inst) => fold(inst, points), parseDataPoints())
draw(foldedPoints)
