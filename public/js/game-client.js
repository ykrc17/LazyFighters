var gameClient = function(socket) {
  socket.on('update', function(data) {
    $('#hp').html(data.hp)

    if(data.progress) {
      var width = data.progress + "%"
      $('#progress-bar').css("width", width)
      $('#progress-bar').html(width)
    }
  })

  socket.on('attrChange', function(data) {
    $('#hp-max').html(data.hpMax)
    $('#hp-regen').html(data.hpRegen)
    $('#atk').html(data.atk)
    $('#atk-spd').html(data.atkSpd)
    $('#atk-cost').html(data.atkCost)
    $('#spd').html(data.spd)
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

  socket.on('positionChange', function(data) {
    position = data
    $('#x').html(position.x)
    $('#y').html(position.y)
  })

  socket.on('statusChange', function(data) {
    if(data.status == "action") {
      $('#action-detail').html(data.detail)
      $('#progress-block').show()
      $('#progress-bar').css("width", "0%")
      $('#progress-bar').html('0%')
    }
    else {
      $('#progress-block').hide()
      $('#action-detail').html('无')
    }
  })

  socket.on('log', function(msg) {
    var newLog = $("<p/>").html(new SimpleDate().toString() + " " + msg)
    $("#log-list").append(newLog)
    $("#log-area").scrollTop($("#log-list").height())
  })
}
