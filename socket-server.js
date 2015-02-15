var fps = 10
var distance = 100

var onlineNumber = 0

var socketServer = function(server) {
  var io = require('socket.io')(server)
  io.on('connection', function(socket) {
    onlineNumber++
    var player = require('./game/player')()
    var gameOn = true

    // event disconnect
    socket.on('disconnect', function() {
      onlineNumber--
      gameOn = false
    })

    socket.on('move', function(msg) {
      player.nextMove(msg, distance)
    })

    // send network data
    var updateNetwork = function() {
      if(!gameOn) {
        return
      }
      data = {
        sendTime: new Date().getTime(),
        onlineNumber: onlineNumber
      }

      socket.emit('network', data)
      setTimeout(function() {
        updateNetwork()
      }, 1000)
    }
    updateNetwork()

    // send game data
    var updateGame = function() {
      if(!gameOn) {
        return
      }
      data = {
        position: {
          x: player.position.x,
          y: player.position.y
        }
      }
      if(!player.finishMove()) {
        data.remaining = player.remaining
        player.move(player.speed / fps)
      }
      
      socket.emit('ui', data)
      if(gameOn) {
        setTimeout(function() {
          updateGame()
        }, 1000/fps)
      }
    }
    updateGame()
  })
}

module.exports = socketServer
