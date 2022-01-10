const { match } = require("assert")
const stringify = require("json-stringify-pretty-compact")
const loadFile = require('../utils/loadFile')
// const src = './sampledata2.txt'
const src = './data.txt'

function loadSensors() {
    return loadFile(src, { split: /\r\n\r\n/ })
        .map(str => str.split(/\r\n/).slice(1).map(str => str.split(',').map(Number)))
        .map(createScanner)
}

function createScanner(beacons, i) {
    const variants = [
        beacons,
        beacons.map(([x,y,z]) => [ x, z,-y]),
        beacons.map(([x,y,z]) => [ x,-y,-z]),
        beacons.map(([x,y,z]) => [ x,-z, y]),
        beacons.map(([x,y,z]) => [ y,-x, z]),
        beacons.map(([x,y,z]) => [ y, z, x]),
        beacons.map(([x,y,z]) => [ y, x,-z]),
        beacons.map(([x,y,z]) => [ y,-z,-x]),
        beacons.map(([x,y,z]) => [-x,-y, z]),
        beacons.map(([x,y,z]) => [-x,-z,-y]),
        beacons.map(([x,y,z]) => [-x, y,-z]),
        beacons.map(([x,y,z]) => [-x, z, y]),
        beacons.map(([x,y,z]) => [-y, x, z]),
        beacons.map(([x,y,z]) => [-y,-z, x]),
        beacons.map(([x,y,z]) => [-y,-x,-z]),
        beacons.map(([x,y,z]) => [-y, z,-x]),
        beacons.map(([x,y,z]) => [ z, y,-x]),
        beacons.map(([x,y,z]) => [ z, x, y]),
        beacons.map(([x,y,z]) => [ z,-y, x]),
        beacons.map(([x,y,z]) => [ z,-x,-y]),
        beacons.map(([x,y,z]) => [-z,-y,-x]),
        beacons.map(([x,y,z]) => [-z,-x, y]),
        beacons.map(([x,y,z]) => [-z, y, x]),
        beacons.map(([x,y,z]) => [-z, x,-y])
    ]

    const gapBeacons = []

    const gaps = variants.map( variant => {
        const spaces = []
        const spaceBeacons = []
        variant.forEach((v1,i) => {
            variant.forEach((v2,j) => {
                if (j<= i) {
                    return
                }
                spaces.push([v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]].join(',')) 
                spaceBeacons.push([i,j])
            })
        })
        gapBeacons.push(spaceBeacons)
        return spaces
    })

    return {
        oriented: i === 0,
        orientation: 0,
        beacons: variants[0],
        beaconsAbs: variants[0],
        origin: [0,0,0],
        variants,
        gaps,
        gapBeacons
    }
}

function mapAtoB(sensorA, sensorB) {
    if (sensorA.oriented || !sensorB.oriented) {
        return
    }
    const gapsB = sensorB.gaps[sensorB.orientation]
    sensorA.gapBeacons.forEach((gapBeaconsA, a) => {
        if (sensorA.oriented) {
            return
        }
        const matches = new Map()
        gapBeaconsA.forEach(
            (ptA, i) => {
                const gapBpos = gapsB.indexOf(sensorA.gaps[a][i])
                if (gapBpos === -1) {
                    return
                }
                matches.set(ptA[0], sensorB.gapBeacons[sensorB.orientation][gapBpos][0])
                matches.set(ptA[1], sensorB.gapBeacons[sensorB.orientation][gapBpos][1])
            }
        )
        if (matches.size === 12) {
            sensorA.orientation = a
            sensorA.matches = matches
            sensorA.oriented = true
            const [matchIndexA, matchIndexB] = sensorA.matches.entries().next().value
            const matchBcnA = sensorA.variants[sensorA.orientation][matchIndexA]
            const matchBcnB = sensorB.beaconsAbs[matchIndexB]
            sensorA.origin = matchBcnA.map((ptA, a) => matchBcnB[a] - ptA)
            sensorA.beaconsAbs = sensorA.variants[sensorA.orientation].map(
                bcn => bcn.map((pt, i) => pt + sensorA.origin[i] )
            )
        }
    })
    return sensorA.oriented
}

function orientSensors() {
    let sensor
    do {
        sensor = sensors.find(({ oriented }) => !oriented )
        let to = 0
        let matched
        do {
            matched = mapAtoB(sensor, sensors[to])
            if (!matched) {
                to++
            }
        } while (!matched && to < sensors.length)
        if (!sensor.oriented) {
            sensors.push(sensors.shift())
        }
    } while (sensors.find(({ oriented }) => !oriented ))

    const allSensors = new Set()
    sensors.forEach(sensor => {
        sensor.beaconsAbs.forEach(beacon => allSensors.add(beacon.join(',')))
    })
    console.log(allSensors.size)
}

const sensors = loadSensors()
orientSensors()