const { match } = require("assert")
const stringify = require("json-stringify-pretty-compact")
const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'

function loadImage() {
    const [algorithm, img] = loadFile(src)
                .replace(/\./g, 0)
                .replace(/\#/g, 1)
                .split(/\r\n\r\n/)
    return {
        algorithm: algorithm.replace(/\r\n/g, ''),
        img: img.split(/\r\n/).map(str => str.split('').map(Number))
    }
}

function logImg(img) {
    img.forEach(row => console.log(row.map(n => n =='0' ? '.' : '1').join('')))
}

function getCell(img, y,x, fallback) {
    const row = img[y]
    const cell = row && row[x]
    return typeof cell === 'undefined' ? fallback : cell
}

function enhanceImage(img, count) {
    const imgH = img.length
    const imgW = img[0].length
    const newImg = []
    for (y = -1; y <= imgH; y++) {
        const row = []
        newImg.push(row)
        for (x = -1; x <= imgW; x++) {
            const fallback = count % 2 === 1 && algorithm[0] === '1' ? 1 : 0
            const inst = [
                getCell(img, y - 1, x - 1, fallback),
                getCell(img, y - 1, x, fallback),
                getCell(img, y - 1, x + 1, fallback),
                getCell(img, y, x - 1, fallback),
                getCell(img, y, x, fallback),
                getCell(img, y, x + 1, fallback),
                getCell(img, y + 1, x - 1, fallback),
                getCell(img, y + 1, x, fallback),
                getCell(img, y + 1, x + 1, fallback)
            ].flat().join('')
            row.push(algorithm[parseInt(inst, 2)])
        }
    }    
    return --count > 0 ? enhanceImage(newImg, count) : newImg
}

const { algorithm, img } = loadImage()
const part1 = enhanceImage(img, 2)
console.log(part1.flat().filter(char => char === '1').length)

const part2 = enhanceImage(img, 50)
console.log(part2.flat().filter(char => char === '1').length)