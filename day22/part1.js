const loadFile = require('../utils/loadFile')
// const src = './sampledata2.txt'
const src = './data.txt'

const clamp = (num) => Math.max(-50, Math.min(50, num)) === num

function loadSteps() {
    const strings = loadFile(src, { split: /\r\n/ })
    const data = strings
        .map(str => str.match(/on|off|(-?\d+)/g))
        .map(([state, ...nums]) => {
            const [x1, x2, y1, y2, z1, z2] = nums.map(Number)
            return {
                state: state === 'on',
                xs: [x1, x2].sort((a,b) => a - b),
                ys: [y1, y2].sort((a,b) => a - b),
                zs: [z1, z2].sort((a,b) => a - b),
            }
        }).filter(({ xs, ys, zs }) => 
            clamp(xs[0]) && clamp(xs[1])
            && clamp(ys[0]) && clamp(ys[1])
            && clamp(zs[0]) && clamp(zs[1])
        )
    return data
    
}

function runStep({ state, xs, ys, zs }) {
    for (let x = xs[0]; x <= xs[1]; x++) {
        for (let y = ys[0]; y <= ys[1]; y++) {
            for (let z = zs[0]; z <= zs[1]; z++) {
                const pos = `${x},${y},${z}`
                if (state) {
                    cubes.add(pos)
                } else if (cubes.has(pos)) {
                    cubes.delete(pos)
                }
            }
        }
    }
}

const cubes = new Set()
const instructions = loadSteps()
instructions.forEach(runStep)
console.log(cubes.size)
