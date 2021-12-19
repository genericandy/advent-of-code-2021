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

const instructions = parseInstructions()
const foldedPoints = fold(instructions[0], parseDataPoints())
console.log(foldedPoints.length)
