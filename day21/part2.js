const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'


function loadStartPositions() {
    return loadFile(src).match(/(?<=\: )(\d+)/gm).map(Number)
}

function createTurnBranches() {
    // values of rolls of 3 dice : number of possible times that number can arise
    const multiplier = {
        3: 1,
        4: 3,
        5: 6,
        6: 7,
        7: 6,
        8: 3,
        9: 1
    }
    const options = new Map()
    for (let pos = 1; pos <= 10; pos++) {
        const ends = []
        for (move = 3; move <= 9; move++) {
            ends.push({nextPosition: (pos + move) % 10 || 10, multiplier: multiplier[move] })
        }
        options.set(pos, ends)
    }
    return options
}

const toLabel = (...args) => args.map(arg => arg.join(',')).join('|')
const fromLabel = str => str.split('|').map(arg => arg.split(',').map(Number))

function buildFirstBoard() {
    return new Map().set(toLabel(loadStartPositions(), [0,0] ), 1)
}

function roll(player) {
    const nextBoard = new Map()
    board.forEach((numInPosition, label) => {
        const [positions, scores] = fromLabel(label)
        const branch = branches.get(positions[player])
        branch.forEach(({ nextPosition, multiplier }) => {
            const nextScore = scores[player] + nextPosition
            if (nextScore >= 21) {
                wins[player] += numInPosition * multiplier
                return
            }
            const nextPositions = [...positions]
            const nextScores = [...scores]
            nextPositions[player] = nextPosition
            nextScores[player] += nextPosition
            const nextLabel = toLabel(nextPositions, nextScores)
            nextBoard.set(nextLabel, (nextBoard.get(nextLabel) ?? 0) + numInPosition * multiplier)
        })
    })
    board = nextBoard
}

const wins = [0,0]
const branches = createTurnBranches()
let board = buildFirstBoard()
let i = 0
while (board.size) {
    roll(i++ % 2)
}
console.log(Math.max(...wins)) 