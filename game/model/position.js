module.exports = function(x, y) {
  return new position(x, y)
}

var position = function(x, y) {
  this.x = x
  this.y = y
}

position.prototype.left = function(){
  return new position(this.x-1, this.y)
}

position.prototype.right = function() {
  return new position(this.x+1, this.y)
}

position.prototype.up = function() {
  return new position(this.x, this.y+1)
}

position.prototype.down = function() {
  return new position(this.x, this.y-1)
}

position.prototype.toString = function() {
  return "x" + this.x + "y" + this.y
}

position.prototype.toJSON = function() {
  return {
    x: this.x,
    y: this.y
  }
}
