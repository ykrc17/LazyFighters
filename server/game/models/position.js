
var Position = function(x, y) {
  this.x = x
  this.y = y
}

Position.prototype.left = function(){
  return new Position(this.x-1, this.y)
}

Position.prototype.right = function() {
  return new Position(this.x+1, this.y)
}

Position.prototype.up = function() {
  return new Position(this.x, this.y+1)
}

Position.prototype.down = function() {
  return new Position(this.x, this.y-1)
}

Position.prototype.equals = function(position) {
  if(!position) {
    return false
  }
  return this.toString() == position.toString()
}

Position.prototype.toString = function() {
  return "x" + this.x + "y" + this.y
}

Position.prototype.toJSON = function() {
  return {
    x: this.x,
    y: this.y
  }
}

module.exports = Position
