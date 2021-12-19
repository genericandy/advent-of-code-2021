const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'
const data = loadFile(src, { split: /\r\n\r\n/ })

const numbers = data.shift().split(',').map(Number)

const cards = data.map(
    card => {
        const rows = card.split(/\r\n/).map(row => row.trim().split(/\s+/).map(Number))
        const cols = rows[0].map( 
            (_, i) => rows.map(
                row => row[i]
            )
        )
        return {
            won: false,
            nums: rows.flat(),
            rows: [...rows, ...cols]
        }
    }
)

function updateCard(card, num) {
    if (card.nums.indexOf(num) === -1 || card.won) {
        return
    }
    card.nums = card.nums.filter(n => n !== num)
    card.rows = card.rows.map( row => row.filter( n => n !== num))
    card.won = !!card.rows.filter(row => !row.length).length
    if (card.won) {
        winners.push(card)
        if (winningNum === null) {
            winningNum = num
        }
    }
}

let winners = []
let winningNum = null

numbers.forEach(
    num => cards.forEach(card => updateCard(card, num))
)

const result = winners[0].nums.reduce((sum, num) => sum + num, 0)

console.log(result * winningNum)