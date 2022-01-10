const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'

const data = loadFile(src)

function buildTarget() {
    const [xMin, xMax, yMin, yMax] = data.match(/-*\d+/g).map(Number)
    return { xMin, xMax, yMin, yMax }
}

function calcVelocities() {
    let factorial = target.xMin
    let current = 0
    let xMin = 0
    while ( factorial > current) {
        current += xMin
        if (current < factorial) {
            xMin++
        }
    }
    return {
        xMax: target.xMax,
        xMin,
        yMax: -(target.yMin + 1),
        yMin: target.yMin
    }
}

function fire(vx, vy) {
    const velId = `${vx},${vy}`
    const drag = {
        x: vx > 0 ? -1 : 1,
        y: -1
    }
    
    let pos = { x: 0, y: 0 }
    while (pos.x <= target.xMax && pos.y >= target.yMin) {
        if (pos.x >= target.xMin 
            && pos.x <= target.xMax
            && pos.y >= target.yMin
            && pos.y <= target.yMax) {
                return velId
        }

        pos.x += vx
        pos.y += vy
        if (vx === 0) {
            if (pos.x < target.xMin) {
                return false
            }
        } else {
            vx += drag.x
        } 
        vy += drag.y
    }

    return false
}

function calcHits() {
    const hits = new Set()
    for (let x = velocities.xMin; x <= velocities.xMax; x++) {
        for (let y = velocities.yMin; y <= velocities.yMax; y++) {
            const hit = fire(x,y)
            if (hit) {
                hits.add(hit)
            }
        }
    }
    return hits
}

const target = buildTarget()
const velocities = calcVelocities()
const hits = calcHits()
console.log(hits.size)