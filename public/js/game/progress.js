var loadProgress = function(socket) {
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
}
