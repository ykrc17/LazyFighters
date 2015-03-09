var position = null

$(function() {
  var socket = io()  
  gameNetwork(socket)
  gameName(socket)
  gameClient(socket)
  gameMap(socket)
  gameAction(socket)
})
