var loadUpdate = function(socket) {
  socket.on("update", function(data) {
    // 玩家状态更新
    $('#hp').html(data.hp)

    // 玩家进度更新
    if(data.progress) {
      var width = data.progress + "%"
      $('#progress-bar').css("width", width)
      $('#progress-bar').html(width)
    }
  })
}
