var constants = require('./game/constants')
var Map = require('./game/map')
var Character = require("./game/character")
var map = new Map(5, 5)
var distance = 100

var onlineNumber = 0

var socketServer = function(server) {
  var io = require('socket.io')(server)
  io.on('connection', function(socket) {
    onlineNumber++
    var player = new Character(map)
    var gameOn = true

    socket.emit('attrChange', player.attr)
    socket.emit('positionChange', player.position.toJSON())
    socket.emit('statusChange', player.getStatusData())

    // character event
    player.on('log', function(msg) {
      socket.emit('log', msg)
    })

    player.on('attrChange', function(attr) {
      socket.emit('attrChange', attr)
    })

    player.on('positionChange', function(position) {
      socket.emit('positionChange', position)
    })

    player.on('statusChange', function(statusData) {
      socket.emit('statusChange', statusData)
    })

    // client event
    socket.on('disconnect', function() {
      map.reset(player.position)
      onlineNumber--
      gameOn = false
    })

    socket.on('target', function(data) {
      if(!data) {
        console.err('invalid parameter')
      }
      player.setTarget(data.x, data.y)
    })

    socket.on('move', function() {
      player.move()
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
      data = {
        hp: Math.floor(player.hp)
      }
      if(player.status != 'idle' && player.status != 'dead') {
        data.progress = player.getProgressData()
      }
      socket.emit('update', data)

      player.update()

      if(gameOn) {
        setTimeout(updateGame, 1000 / constants.fps)
      }
    }
    updateGame()

  })
}

module.exports = socketServer
