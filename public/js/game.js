$(function() {
  var socket = io()
  var buttonLeft = $('#btn-left')
  var buttonUp = $('#btn-up')
  var buttonDown = $('#btn-down')
  var buttonRight = $('#btn-right')
  var processTable = $('#process-table')

  buttonLeft.click(function() {
    socket.emit('move', 'left')
  })

  buttonUp.click(function() {
    socket.emit('move', 'up')
  })

  buttonDown.click(function() {
    socket.emit('move', 'down')
  })

  buttonRight.click(function() {
    socket.emit('move', 'right')
  })

  processTable.hide()

  socket.on('network', function(data) {
    $('#ping').html(new Date().getTime() - data.sendTime)
    $('#online-number').html(data.onlineNumber)
  })

  socket.on('ui', function(data) {
    $('#x').html(data.position.x)
    $('#y').html(data.position.y)
    if(data.remaining) {
      $('#process-table').show()
      $('#process-data').html(data.remaining)
    }
    else {
      $('#process-table').hide()
    }
  })
})
