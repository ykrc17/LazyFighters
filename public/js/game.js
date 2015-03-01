$(function() {
  var socket = io()
  var position = null

  // target
  var targetLeft = $('#target-left')
  var targetUp = $('#target-up')
  var targetDown = $('#target-down')
  var targetRight = $('#target-right')
  var progressTable = $('#progress-table')
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
  var actionMove = $("#action-move")
  actionMove.click(function() {
    socket.emit("move")
  })
  var actionAttack = $('#action-attack')
  actionAttack.click(function() {
    socket.emit('attack')
  })

  progressTable.hide()

  // socket listeners
  socket.on('network', function(data) {
    $('#ping').html(new Date().getTime() - data.sendTime)
    $('#online-number').html(data.onlineNumber)
  })

  socket.on('update', function(data) {
    $('#hp').html(data.hp)

    if(data.progress) {
      var width = data.progress + '%'
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

  socket.on('positionChange', function(data) {
    position = data
    $('#x').html(position.x)
    $('#y').html(position.y)
  })

  socket.on('statusChange', function(data) {
    if(data.action) {
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
    console.log(msg)
  })
})
