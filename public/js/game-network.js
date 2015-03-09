var gameNetwork = function(socket) {
  socket.on('network', function(data) {
    $('#online-number').html(data.onlineNumber)
  })
}
