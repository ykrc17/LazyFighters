var loadName = function(socket) {
  var name = $("#name").val()
  $("#name").blur(function() {
    $("#name").val($("#name").val().substr(0, 10))
    if(name != $("#name").val()) {
      socket.emit("client-name", $("#name").val())
      var name = $("#name").val()
    }
  })
}
