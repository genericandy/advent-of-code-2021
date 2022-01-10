const { create } = require('domain')
const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const srcStr = loadFile(src)

function strToBits(str) {
    return str.split('').map(s => parseInt(s, 16).toString(2).padStart(4, '0')).join('')
}

function parseLiteral(str) {
    let [bits] = str.match(/^(1\d{4})*(0\d{4})/)
    str = str.slice(bits.length)
    let bitStr = ''
    while (bits.length) {
        bitStr += bits.slice(1,5)
        bits = bits.slice(5)
    }
    return {
        val: parseInt(bitStr, 2),
        str: str
    } 
}

function parseOperator(str) {
    const lengthType = str[0]
    const lengthEnd = lengthType === '1' ? 11 : 15
    str = str.slice(1)
    const opBitsLength = parseInt(str.slice(0, lengthEnd), 2)
    str = str.slice(lengthEnd)
    let packets = []
    if (lengthType === '0') {
        const parsedBits = parseBinaryString(str.slice(0, opBitsLength))
        packets = parsedBits.packets
        str = str.slice(opBitsLength)
    } else {
        const parsedBits = parseBinaryString(str, opBitsLength)
        packets = parsedBits.packets
        str = parsedBits.str
    }
    return { packets, str }
}

function parseBinaryString(str, limit = Infinity) {
    const packets = []
    while (str.length && limit--) {
        if (/^0*$/g.test(str)) {
            break
        }

        const packet = {
            version: parseInt(str.slice(0,3), 2),
            type: parseInt(str.slice(3,6), 2)
        }
        packets.push(packet)
        str = str.slice(6)
        
        if (packet.type === 4) {
            const literal = parseLiteral(str)
            packet.val = literal.val
            str = literal.str
        } else {
            const operator = parseOperator(str)
            packet.packets = operator.packets
            str = operator.str
        }
    }
    return {packets, str}
}

function calcVersionSum(topPacket) {
    return topPacket.packets.reduce((total, packet) => {
        if (packet.packets)
            return total + packet.version + calcVersionSum(packet)
        else {
            return total + packet.version
        }
    }, 0)
}


const bits = strToBits(srcStr)
const topPacket = parseBinaryString(bits)
// console.log(JSON.stringify(topPacket, null, 2))
const versionSum = calcVersionSum(topPacket)
console.log(versionSum)