var loadNetwork = function(socket) {
  socket.on('network', function(data) {
    $('#online-number').html(data.onlineNumber)
  })
}
