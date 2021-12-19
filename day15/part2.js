const { create } = require('domain')
const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const baseGrid = loadFile(src, { split: /\r\n/ }).map(str => str.split('').map(Number))
const nodes = new Map()
const maxX = baseGrid[0].length * 5 - 1
const maxY = baseGrid.length * 5 - 1

function createMap() {
    for (y = 0; y < 5; y++) {
        for (x = 0; x < 5; x++) {
            createGridPlot(y, x)
        }
    }
    nodes.get(`${maxY},${maxX}`).isEnd = true
}

function createGridPlot(gridX, gridY) {
    const baseX = gridX * baseGrid[0].length
    const baseY = gridY * baseGrid.length
    baseGrid.forEach((row, y) => {
        row.forEach((val, x) => {
            const edges = [
                `${baseX + x+1},${baseY + y}`,
                `${baseX + x-1},${baseY + y}`,
                `${baseX + x},${baseY + y+1}`,
                `${baseX + x},${baseY + y-1}`
            ]
            let gridVal = val + gridX + gridY
            while (gridVal >= 10) {
                gridVal -= 9
            }
            const id = `${baseX + x},${ baseY + y}`
            nodes.set(
                id,
                {
                    id, edges,
                    val: gridVal,
                    score: Infinity,
                    isEnd: false
                }
            )
        })
    })
}

function updateNodeScore(node, score) {
    const newScore = score + node.val
    if (newScore >= node.score) {
        return false
    }
    node.score = newScore
    return true
}

function findPath () {
    nodes.get('0,0').score = 0
    const queue = []
    queue.push(nodes.get('0,0'))
    while (queue.length) {
        const node = queue[0]
        node.edges.forEach(edge => {
            if (!nodes.has(edge)) {
                return
            }
            const edgeNode = nodes.get(edge)
            if (updateNodeScore(edgeNode, node.score)) {
                queue.push(edgeNode)
            }
        })
        queue.shift()
    }
}

createMap()
findPath()
console.log(nodes.get(`${maxY},${maxX}`).score)