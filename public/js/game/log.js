var loadLog = function(socket) {
  socket.on('log', function(msg) {
    var newLog = $("<p/>").html(new SimpleDate().toString() + " " + msg)
    $("#log-list").append(newLog)
    $("#log-area").scrollTop($("#log-list").height())
  })
}
