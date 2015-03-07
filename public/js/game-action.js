var gameAction = function(socket) {
  var actionMove = $("#action-move")
  actionMove.click(function() {
    socket.emit("action", "move")
  })

  var actionAttack = $('#action-attack')
  actionAttack.click(function() {
    socket.emit("action", "attack")
  })
  
  $(document).keydown(function(event) {
    switch(getKeyName(event.which)) {
      case "A":
        actionAttack.click()
        break
      case "S":
        actionMove.click()
        break
    }
  })
}
