$(function() {
  var socket = io()
  var position = null

  // move
  var moveLeft = $('#move-left')
  var moveUp = $('#move-up')
  var moveDown = $('#move-down')
  var moveRight = $('#move-right')
  moveLeft.click(function() {
    socket.emit('move', 'left')
  })

  moveUp.click(function() {
    socket.emit('move', 'up')
  })

  moveDown.click(function() {
    socket.emit('move', 'down')
  })

  moveRight.click(function() {
    socket.emit('move', 'right')
  })

  // target
  var targetLeft = $('#target-left')
  var targetUp = $('#target-up')
  var targetDown = $('#target-down')
  var targetRight = $('#target-right')
  var processTable = $('#process-table')
  targetLeft.click(function() {
    if(position) {
      socket.emit('target', {x: position.x-1, y: position.y})
    }
  })

  targetUp.click(function() {
    if(position) {
      socket.emit('target', {x: position.x, y: position.y+1})
    }
  })

  targetDown.click(function() {
    if(position) {
      socket.emit('target', {x: position.x, y: position.y-1})
    }
  })

  targetRight.click(function() {
    if(position) {
      socket.emit('target', {x: position.x+1, y: position.y})
    }
  })

  // actions
  var actionAttack = $('#action-attack')
  actionAttack.click(function() {
    socket.emit('attack')
  })

  processTable.hide()

  socket.on('network', function(data) {
    $('#ping').html(new Date().getTime() - data.sendTime)
    $('#online-number').html(data.onlineNumber)
  })

  socket.on('game', function(data) {
    if(data.remaining) {
      $('#move-status').show()
      $('#move-process').html(data.remaining)
    }
    else {
      $('#move-status').hide()
    }
  })

  socket.on('attr', function(data) {
    $('#hp').html(data.hp)
    $('#max-hp').html(data.maxHp)
    $('#atk').html(data.atk)
    $('#spd').html(data.spd)
  })

  socket.on('position', function(data) {
    position = data
    $('#x').html(position.x)
    $('#y').html(position.y)
  })

  socket.on('log', function(msg) {
    console.log(msg)
  })
})
