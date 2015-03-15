var loadMap = function(socket) {
  for(var i=-2; i<=2; i++) {
    for(var j=-2; j<=2; j++) {
      $("#a"+j+"b"+i).attr({x: j,y: i})
      $("#a"+j+"b"+i).click(function() {
        socket.emit("target", {x:position.x+Number($(this).attr("x")), y:position.y+Number($(this).attr("y"))})
      })
    }
  }

  socket.on('positionChange', function(data) {
    position = data
    $('#x').html(position.x)
    $('#y').html(position.y)
  })

  socket.on("mapChange", function(data) {
    for(var i=0; i<25; i++) {
      var key = "a"+(i%5-2)+"b"+(Math.floor(i/5)-2)
      switch(data[i]) {
        case "invalid":
          $("#"+key).attr("class", "btn btn-action")
          break
        case "default":
          $("#"+key).attr("class", "btn btn-default btn-action")
          break
        case "target":
          $("#"+key).attr("class", "btn btn-info btn-action")
          break
        case "enemy":
          $("#"+key).attr("class", "btn btn-danger btn-action")
          break
        case "player":
          $("#"+key).attr("class", "btn btn-success btn-action")
          break
      }
    }
  })
}
