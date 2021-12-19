const { create } = require('domain')
const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ }).map(str => str.split('').map(Number))
const nodes = new Map()
const maxX = data[0].length - 1
const maxY = data.length - 1

function createMap() {
    data.forEach((row, y) => {
        row.forEach((val, x) => {
            const edges = [
                `${x+1},${y}`,
                `${x-1},${y}`,
                `${x},${y+1}`,
                `${x},${y-1}`
            ]
            const id = `${x},${y}`
            nodes.set(
                id,
                {
                    id, edges, val,
                    score: Infinity,
                    isEnd: x === maxX && y === maxY
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
console.log(nodes.get(`${maxX},${maxY}`).score)