const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n\r\n/ })
const pairs = new Map()

function mapPairs() {
    data[1]
        .split(/\r\n/)
        .forEach(str => {
            const [ key, val ] = str.split(' -> ')
            pairs.set(key, [key[0]+val, val+key[1]])
        });
}

function buildFirstTemplate() {
    const firstTemplate = new Map();
    let lastLtr
    for (ltr of data[0]) {
        if (lastLtr) {
            const key = lastLtr + ltr
            firstTemplate.set(key, firstTemplate.has(key) ? firstTemplate.get(key) + 1 : 1)
        }
        lastLtr = ltr
    }
    return firstTemplate
}

function iterate(template, count) {
    const newTemplate = new Map();
    [...template.entries()].forEach(([key, value]) => {
        pairs.get(key).forEach(pair =>
            newTemplate.set(
                pair,
                newTemplate.has(pair) ? newTemplate.get(pair) + value : value
            )
        )
    })
    if (--count) {
        return iterate(newTemplate, count)
    }
    return newTemplate
}

function count(template, finalLetter) {
    const els = new Map();
    [...template.entries()].forEach(([key, value]) => {
        const el = key[0]
        els.set(el, els.has(el) ? els.get(el) + value : value)
    })
    els.set(finalLetter, els.get(finalLetter) + 1)
    return [...els.entries()].sort((el1, el2) => el1[1] - el2[1])
}

mapPairs()
const elCount = count(
    iterate(buildFirstTemplate(), 40),
    data[0].slice(-1)
)

console.log(elCount.pop()[1] - elCount.shift()[1])