const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
// const src = './sampledata2.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n/ })
const splitAndSort = str => str.trim().split(/\s+/).map(str => str.split('').sort().join(''))
const findAndRemove = ( query, strs ) => strs.splice(strs.findIndex(query), 1)[0]

const codes = data
    .map( str => str.split('|'))
    .map( ([str1, str2]) => ({
            strs: splitAndSort(str1),
            digits: splitAndSort(str2)
        }) )

function decode({ strs, digits }) {
    const nums = []

    nums[1] = findAndRemove(str => str.length === 2, strs)

    const [r1, r2] = nums[1]

    nums[4] = findAndRemove(str => str.length === 4, strs)
    nums[7] = findAndRemove(str => str.length === 3, strs)
    nums[8] = findAndRemove(str => str.length === 7, strs)
    nums[6] = findAndRemove(str => str.length === 6 && ((str.includes(r1) && !str.includes(r2)) || (str.includes(r2) && !str.includes(r1))), strs)
    nums[3] = findAndRemove(str => str.length === 5 && str.includes(r1) && str.includes(r2), strs)

    const leftBars = nums[8].split('').filter(ltr => !nums[3].includes(ltr))
    const [topL, bottomL] = nums[4].includes(leftBars[0]) ? leftBars : leftBars.reverse()

    nums[9] = findAndRemove(str => str.length === 6 && str.includes(topL) && !str.includes(bottomL), strs)
    nums[0] = findAndRemove(str => str.length === 6, strs)
    nums[5] = findAndRemove(str => str.indexOf(topL) !== -1, strs)
    nums[2] = strs[0]

    return +digits.map(str => nums.indexOf(str)).join('')
}

console.log( codes.reduce((total, code) => total + decode(code), 0) )