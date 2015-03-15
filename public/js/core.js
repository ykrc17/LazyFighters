var position = null

$(function() {
  var socket = io()

  // game
  loadAction(socket)
  loadCharacter(socket)
  loadLog(socket)
  loadMap(socket)
  loadName(socket)
  loadProgress(socket)
  loadUpdate(socket)

  // network
  loadNetwork(socket)
})
