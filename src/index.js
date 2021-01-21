//Requires
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const port = process.env.PORT || 3000

const public = path.join(__dirname, '../public')
app.use(express.static(public))
const server = http.createServer(app)
const io = socketio(server)

//Global vars
var aNumbers = [1, 2, 3, 4, 5, 6]
var CurrScore = 0
var current_turn = 0;
var turn = 0
var players = []
var objPlayerInfo = {}
var scoreData = {}
var aPlayerData = []

const checkWin = (total, socket) => {
    if (total >= 50) {
        io.emit('showLoseMessage', 'You Lose!')
        socket.emit('showWinMessage', 'Scored 50. You Win!')
        resetAll()
    }
}

const resetAll = () => {
    totalScore = 0
    CurrScore = 0
    turn = 0
    current_turn = 0
    players = []
}

function addPlayerScore(score, currTurn) {

    aPlayerData[currTurn].currScore = score;
    aPlayerData[currTurn].totalDice += score;
    return aPlayerData[currTurn].totalDice
}


//Socket Connection
io.on('connection', (socket) => {

    console.log('A player joined')

    players.push(socket)
    objPlayerInfo.ID = socket.id
    objPlayerInfo.totalDice = 0
    objPlayerInfo.turnID = players.length - 1
    objPlayerInfo.currScore = 0
    aPlayerData.push(objPlayerInfo)
    objPlayerInfo = {}

    getDiceNumber(socket)
})

function getDiceNumber(socket){
    socket.on('getDiceNumber', () => {
        var item = aNumbers[Math.floor(Math.random() * aNumbers.length)];
        io.emit('showNumber', item)

        const checkWinTotal = addPlayerScore(item, turn)

        checkWin(checkWinTotal, socket)
        scoreData.aPlayer = aPlayerData
        scoreData.currTurnId = turn
        io.emit('showTurnData', JSON.stringify(scoreData))
        nextTurn()
    })
}

function nextTurn() {
    if (turn == players.length - 1) {
        turn = 0
    } else {
        turn++
    }
}

//Start Server
server.listen(port, () => {
    console.log('Server running!')
})