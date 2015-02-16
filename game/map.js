/*
  map
    记录地图上的玩家
  参数
    xmax
      x坐标最大值
    ymax
      y坐标最大值
*/
module.exports  = function(xmax, ymax) {
  return new map(xmax, ymax)
}
var map = function(xmax, ymax) {
  if(!xmax || !ymax) {
    console.log("map.js : Alert - not enough parameters")
  }
  this.data = []
  this.xmax = xmax
  this.ymax = ymax
}

map.prototype.get = function(position) {
  var key = position.toString()
  return this.data[key]
}

map.prototype.set = function(position, player) {
  var key = position.toString()
  if(!this.data[key]) {
    this.data[key] = player
  }
}

map.prototype.remove = function(position) {
  var key = position.toString()
  this.data[key] = null
}

map.prototype.generatePosition = function() {
  var x = Math.floor(Math.random() * this.xmax)
  var y = Math.floor(Math.random() * this.ymax)
  return require('./model/position')(x, y)
}
