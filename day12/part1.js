const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const nodes = new Map()
const Size = { Small: 'Small', Large: 'Large' }
const paths = []

function addNode(a, b) {
    if (!nodes.has(a)) {
        nodes.set(a, {
            size: /[a-z]+/.test(a) ? Size.Small : Size.Large,
            edges: [],
            key: a
        })
    }
    if (b !== 'start' && a !== 'end') {
        nodes.get(a).edges.push(b)
    }
}

function createNodes() {
    data.forEach(path => {
        const [a, b] = path.split('-')
        addNode(a, b)
        addNode(b, a)
    })
}

function createPath(path) {
    return {
        nodes: path ? [...path.nodes] : []
    }
}

function findPaths(key, path) {
    const newPath = createPath(path)
    newPath.nodes.push(key)
    const node = nodes.get(key)

    if (key === 'end') {
        paths.push(newPath.nodes)
        return
    }

    node.edges.filter(
        edge => {
            const edgeNode = nodes.get(edge)
            if (edgeNode.size === Size.Small) {
                return !path.nodes.includes(edge)
            } else {
                return edgeNode.edges.filter(edge => !path.nodes.includes(edge))
            }
        })
        .forEach( edge => {
            findPaths(edge, newPath)
        })
}

createNodes()
findPaths('start', createPath())
console.log(paths.length)