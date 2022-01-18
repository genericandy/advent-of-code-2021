const stringify = require("json-stringify-pretty-compact")
const loadFile = require('../utils/loadFile')
const src = './sampledata.txt'
// const src = './data.txt'

class Cuboid {
    constructor(onOff, nums) {
        const [x1, x2, y1, y2, z1, z2] = nums.map(Number)
        const xs = [x1, x2].sort((a,b) => a - b)
        const ys = [y1, y2].sort((a,b) => a - b)
        const zs = [z1, z2].sort((a,b) => a - b)
        
        this.on = onOff === 'on',
        this.a = [xs[0], ys[0], zs[0]],
        this.b = [xs[1], ys[1], zs[1]],
        this.cubes = (xs[1] - xs[0] + 1) * (ys[1] - ys[0] + 1)  * (zs[1] - zs[0] + 1)
        this.removed = false
        this.removals = []
    }

    findOverlap(cube) {
        // basically do nothing
        if (this.removed 
            || comparePts(this.a, 'gt', 'or', cube.b) 
            || comparePts(this.b, 'lt', 'or', cube.a) ) {
            return { type: 'no overlap' }
        }
        // if on state matches, keep the bigger one
        // if outside is off, we can toss both
        // if inside is off, add the removal to to the outside
        if (comparePts(this.a, 'gte', 'and', cube.a) && comparePts(this.b, 'lte', 'and', cube.b)) {
            return {
                type: 'a inside b',
                points: { a: this.a, b: this.b }
            }
            
        }
        if (comparePts(this.a, 'lte', 'and', cube.a) && comparePts(this.b, 'gte', 'and', cube.b)) {
            return {
                type: 'b inside a',
                points: { a: cube.a, b: cube.b }
            }
        }
        // if on states match, remove the overlap from one
        // if on & off, add the removal to the on
        // if both are off, we can toss both
        const intA = this.a.map((axis, i) => Math.max(axis, cube.a[i]))
        const intB = this.b.map((axis, i) => Math.min(axis, cube.b[i]))
        const intNums = [intA[0], intB[0], intA[1], intB[1], intA[2], intB[2]] 
        const intersection = new Cuboid('off', intNums)

        return {
            type: 'intersects',
            points: { a: intersection.a, b: intersection.b }
        }
    }

    remove(points) {
        if (points === 'all') {
            this.cubes = 0
            this.removed = true
            return
        }
        const cubePts = [points.a[0], points.b[0], points.a[1], points.b[1], points.a[2], points.b[2]] 
        this.removals.push(new Cuboid('on', cubePts))
    }

    explode(cube) {
        // this a1 b1 c1 -> a2 b2 c2
        // int d1 e1 f1 -> d2 e2 f2

        // top rows
        // a1 b1 c1 -> d1 e1 f1
        // d1 b1 c1 -> d2 e1 f1
        // d2 b1 c1 -> a2 e1 f1

        // a1 b1 f1 -> d1 e1 f2
        // d1 b1 f1 -> d2 e1 f2
        // d2 b1 f1 -> a2 e1 f2

        // a1 b1 f2 -> d1 e1 c2
        // d1 b1 f2 -> d2 e1 c2
        // d2 b1 f2 -> a2 e1 c2

        // middle rows
        // a1 e1 c1 -> d1 e2 f1
        // d1 e1 c1 -> d2 e2 f1
        // d2 e1 c1 -> a2 e2 f1

        // a1 e1 f1 -> d1 e2 f2
        // intersection
        // d2 e1 f1 -> a2 e2 f2

        // a1 e1 f2 -> d1 e2 c2
        // d1 e1 f2 -> d2 e2 c2
        // d2 e1 f2 -> a2 e2 c2

        // bottom
        // a1 e2 c1 -> d1 b2 f1
        // d1 e2 c1 -> d2 b2 f1
        // d2 e2 c1 -> a2 b2 f1

        // a1 e2 f1 -> d1 b2 f2
        // d1 e2 f1 -> d2 b2 f2
        // d2 e2 f1 -> a2 b2 f2

        // a1 e2 f2 -> d1 b2 c2
        // d1 e2 f2 -> d2 b2 c2
        // d2 e2 f2 -> a2 b2 c2
    }
}

function loadCuboids() {
    const strings = loadFile(src, { split: /\r\n/ })
    const data = strings
        .map(str => str.match(/on|off|(-?\d+)/g))
        .map(([onOff, ...nums]) => new Cuboid(onOff, nums))
    return data
}

function comparePts(pt1, gtlt, andOr, pt2) {
    if (gtlt === 'gt') {
        return andOr === 'and'
            ? pt1[0] > pt2[0] && pt1[1] > pt2[1] && pt1[2] > pt2[2]
            : pt1[0] > pt2[0] || pt1[1] > pt2[1] || pt1[2] > pt2[2]
    }
    if (gtlt === 'gte') {
        return andOr === 'and' 
            ? pt1[0] >= pt2[0] && pt1[1] >= pt2[1] && pt1[2] >= pt2[2]
            : pt1[0] >= pt2[0] || pt1[1] >= pt2[1] || pt1[2] >= pt2[2]
    }
    if (gtlt === 'lte') {
        return andOr === 'and'
            ? pt1[0] <= pt2[0] && pt1[1] <= pt2[1] && pt1[2] <= pt2[2]
            : pt1[0] <= pt2[0] || pt1[1] <= pt2[1] || pt1[2] <= pt2[2]
    }
    // 'lt'
    return andOr === 'and'
        ? pt1[0] < pt2[0] && pt1[1] < pt2[1] && pt1[2] < pt2[2]
        : pt1[0] < pt2[0] || pt1[1] < pt2[1] || pt1[2] < pt2[2]
}

function removeFullOverlaps(cuboidList, cuboid, i) {
    if (!i) return
    let j = i
    let prevCuboid
    do {
        prevCuboid = cuboidList[j - 1]
        if (!prevCuboid.on) continue
        
        const overlap = cuboid.findOverlap(prevCuboid)
        
        if (overlap.type === 'a inside b' && cuboid.on) {
            newCuboid.remove('all')
        } else if (overlap.type === 'b inside a') {
            prevCuboid.remove('all')
        }
    } while (--j > 0 && prevCuboid.on)
}

function addCuboidsToStack(cuboidList, stack, newCube, i) {
    if (!stack.size) {
        if (!newCube.removed && newCube.on) {
            stack.set('cube'+ i, newCube)
        }
        return
    }
    let j = i
    do {
        const oldCube = cuboidList[j - 1]
        const overlap = newCube.findOverlap(oldCube)
        if (overlap.type === 'a inside b' && !newCube.on) {
            newCube.remove(overlap.points)
            continue
        }
        if (overlap.type === 'intersects') {
            newCube.remove(overlap.points)
            continue
        }
    } while (--j > 0)

    if (!newCube.removed) {
        console.log('add cube ', i)
        stack.set('cube'+ i, newCube)
    }
}

function countCubes(total, cube) {
    let cubeTotal = 0
    if (cube.on) {
        cubeTotal += cube.cubes
    } 
    
    if (cube.removal.length) {
        // merge them and subtract the total
    }

    return total + cubeTotal
}

function solve() {
    const cuboids = loadCuboids()
    const stack = new Map()
    
    cuboids.forEach((cuboid, i) => removeFullOverlaps(cuboids, cuboid, i))
    cuboids.forEach((cuboid, i) => addCuboidsToStack(cuboids, stack, cuboid, i))
    
    let total = stack.reduce(countCubes, 0)
    
    stack.forEach(cube => {
        console.log('--')
        console.log(stringify(cube, {maxLength: 40, indent: ' '}))
        // console.log(cube)
    })   
}

solve()