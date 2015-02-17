var fps = 10
var distance = 100
var map = require('./game/map')(10, 10)

var onlineNumber = 0

var socketServer = function(server) {
  var io = require('socket.io')(server)
  io.on('connection', function(socket) {
    onlineNumber++
    var player = require('./game/character')(map)
    var gameOn = true

    var sendAttr = function(attr) {
      socket.emit('attr', attr)
    }
    sendAttr(player.attr)

    var sendPosition = function(position) {
      socket.emit('position', position.toJSON())
    }
    sendPosition(player.position)

    // character event
    player.on('log', function(msg) {
      socket.emit('log', msg)
    })

    player.on('positionChange', function(position) {
      sendPosition(position)
    })

    player.on('attrChange', function(attr) {
      sendAttr(attr)
    })

    // client event
    socket.on('disconnect', function() {
      onlineNumber--
      gameOn = false
    })

    socket.on('move', function(direction) {
      if(!direction) {
        console.err('invalid parameter')
      }
      player.move(direction, distance)
    })

    socket.on('target', function(data) {
      if(!data) {
        console.err('invalid parameter')
      }
      player.setTarget(data.x, data.y)
    })

    socket.on('attack', function() {
      player.attack()
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
      setTimeout(updateNetwork, 1000)
    }
    updateNetwork()

    // send game data
    var updateGame = function() {
      if(!gameOn) {
        return
      }
      data = {}
      if(player.status != 'idle') {
        data.remaining = player.remaining
      }
      socket.emit('game', data)

      player.update()

      if(gameOn) {
        setTimeout(updateGame, 1000/fps)
      }
    }
    updateGame()

  })
}

module.exports = socketServer
