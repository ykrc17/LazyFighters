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
    socket.emit("mapChange", player.getMapData())

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

    player.on("mapChange", function(mapData) {
      socket.emit("mapChange", mapData)
    })

    // client event
    socket.on('action', function(data) {
      switch(data) {
        case "move":
          player.move()
          break
        case "attack":
          player.attack()
          break
      }
    })

    socket.on('disconnect', function() {
      map.reset(player.position)
      onlineNumber--
      gameOn = false
    })

    socket.on("client-name", function(data) {
      player.name = data
    })

    socket.on('target', function(data) {
      if(!data)
        return
      if(player.targetPosition && data.x == player.targetPosition.x && data.y == player.targetPosition.y) {
        return
      }
      player.setTarget(data.x, data.y)
    })


    // send network data
    var updateNetwork = function() {
      if(!gameOn) {
        return
      }
      data = {
        onlineNumber: onlineNumber
      }

      socket.emit('network', data)
      setTimeout(updateNetwork, 10000)
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
      if(player.status == "action") {
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
