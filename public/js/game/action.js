var getKeyName = function(keyCode) {
  if(keyCode >=65 && keyCode <=90) {
    return String.fromCharCode(keyCode)
  }

  if(keyCode >=48 && keyCode <= 57) {
    return String.fromCharCode(keyCode)
  }
}

var loadAction = function(socket) {
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
