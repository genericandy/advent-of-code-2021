const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })

const commands = data.map( 
    str => {
        const command = str.split(' ')
        command[1] = +command[1]
        return command
    }
)

const position = commands.reduce(
    ({ d, h }, [dir, distance]) => {
        if (dir === 'forward') {
            h = distance + h
        } else {
            const dirD = dir === 'up' ? -1 : 1
            d = distance * dirD + d
        }
        return { h, d }
    }, { h: 0, d: 0 }
)

console.log(position.h * position.d)