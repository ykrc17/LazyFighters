module.exports = function(map, fn) {
  return new player(map, fn)
}

var constants = require('./constants')

var player = function(map, fn) {
  // public
  this.position = map.generatePosition()
  this.speed = 20
  this.next = null
  this.status = "idle"
  this.remaining = null

  // private
  this.map = map
  this.fn = fn
}

player.prototype.nextMove = function(direction, distance) {
  switch(direction) {
    case 'left':
      this.next = this.position.left()
      break
    case 'right':
      this.next = this.position.right()
      break
    case 'up':
      this.next = this.position.up()
      break
    case 'down':
      this.next = this.position.down()
      break
  }
  if(this.map.get(this.next)) {
    this.fn("该位置已被人占领")
    return
  }
  this.setStatus("moving")
  this.remaining = distance
}

player.prototype.isMoving = function() {
  return this.status == "moving"
}

player.prototype.move = function(shift) {
  if(this.map.get(this.next)) {
    this.setStatus("idle")
    this.fn("该位置已被人占领")
    return
  }

  this.remaining -= shift
  if(this.remaining <= 0) {
    this.map.remove(this.position)
    this.map.set(this.next, this)

    this.position = this.next
    this.next = null
    this.setStatus("idle")
    this.fn("player " + this.id + " has moved to position : " + this.position.toString())
  }
}

player.prototype.setStatus = function(status) {
  this.status = status
  this.fn("status set to `" + status + "`")
}

player.prototype.update = function() {
  if(this.isMoving()) {
    this.move(this.speed / constants.fps)
  }
}
