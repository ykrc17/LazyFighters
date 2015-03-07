var position = null

$(function() {
  var socket = io()
  gameClient(socket)
  gameMap(socket)
  gameAction(socket)
})
