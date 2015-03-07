var gameMap = function(socket) {
  for(var i=-2; i<=2; i++) {
    for(var j=-2; j<=2; j++) {
      $("#a"+j+"b"+i).attr({x: j,y: i})
      $("#a"+j+"b"+i).click(function() {
        socket.emit("target", {x:position.x+Number($(this).attr("x")), y:position.y+Number($(this).attr("y"))})
      })
    }
  }
}
