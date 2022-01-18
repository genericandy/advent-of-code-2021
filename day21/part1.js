const loadFile = require('../utils/loadFile')
// const src = './sampledata.txt'
const src = './data.txt'

function loadStartPositions() {
    return loadFile(src).match(/(?<=\: )(\d+)/gm).map(Number)
}

function playGame() {
    let turn = 0
    let winner = -1
    let lastRoll = 0
    let totalRolls = 0
    const scores = [0,0]
    const positions = loadStartPositions()
    const winningScore = 1000
    const tiles = 10
    while (winner === -1) {
        const player = turn % 2
        let rollScore = 0
        let roll = 3
        while(roll--) {
            lastRoll = (lastRoll + 1) % 100 || 100
            rollScore += lastRoll
            totalRolls++
        }
        positions[player] = (positions[player] + rollScore) % tiles || 10
        scores[player] += positions[player]
        turn++
        winner = scores.findIndex(score => score >= winningScore)
    }

    console.log(Math.min(...scores) * totalRolls)
}

playGame()