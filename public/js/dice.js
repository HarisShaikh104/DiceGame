const socket = io()

//Dice Numbers
socket.on('showNumber', (diceNo) => {
    document.getElementById('pNum').innerHTML = 'Rolled: <b>' + diceNo + '</b>'
    document.getElementById('pTurn').style.display = "none"
})

//Show Turn Data
socket.on('showTurnData', (total) => {
    var rollInfo = JSON.parse(total)
    console.log(rollInfo)

    document.getElementById('scoreCnt').innerHTML = ""
    rollInfo.aPlayer.forEach(item => {
        var p = document.createElement('p')
        var p2 = document.createElement('p')
        p.id = "pTotal"
        p.innerHTML = '<b>Player ' + (item.turnID + 1) + ': ' + item.totalDice + '</b>'
        document.getElementById('scoreCnt').appendChild(p2)
        document.getElementById('scoreCnt').appendChild(p)
    });
})

//Winners Message
socket.on('showWinMessage', (msg) => {
    document.getElementById('pWin').innerHTML = msg
    document.getElementById('btnSend').disabled = true
})

socket.on('showLoseMessage', (msg) => {
    document.getElementById('pWin').innerHTML = msg
    document.getElementById('btnSend').disabled = true
})

//Turn Message
socket.on('showTurn', () => {
    document.getElementById('pTurn').innerHTML = 'Your Turn..'
})

//Button Click Event
document.querySelector('#btnSend').addEventListener('click', () => {
    socket.emit('getDiceNumber')
})