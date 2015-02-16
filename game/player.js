var player = function() {
  this.position = require('./model/position')(10, 10)
  this.speed = 10
  this.next = null
  this.moveCallback = null
}

player.prototype.nextMove = function(direction, distance, moveCallback) {
  switch(direction) {
    case 'left':
      this.remaining = distance
      this.next = this.position.left()
      break
    case 'right':
      this.remaining = distance
      this.next = this.position.right()
      break
    case 'up':
      this.remaining = distance
      this.next = this.position.up()
      break
    case 'down':
      this.remaining = distance
      this.next = this.position.down()
      break
  }
  this.moveCallback = moveCallback ? moveCallback : function(){}
}

player.prototype.isMoving = function() {
  return this.next != null
}

player.prototype.move = function(distance) {
  if(this.isMoving()) {
    this.remaining -= distance
    if(this.remaining <= 0) {
      this.moveCallback(this.position, this.next)
      this.position = this.next
      this.next = null
    }
  }
}

var createPlayer = function() {
  return new player()
}

module.exports = createPlayer
