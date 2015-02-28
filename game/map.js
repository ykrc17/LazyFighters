/*
  map
    记录地图上的玩家
  参数
    xmax
      x坐标最大值
    ymax
      y坐标最大值
*/
var Position = require("./model/position")

var Map = function(xmax, ymax) {
  if(!xmax || !ymax) {
    console.log("map.js : Alert - not enough parameters")
  }
  this.data = []
  this.xmax = xmax
  this.ymax = ymax
}

Map.prototype.get = function(position) {
  var key = position.toString()
  return this.data[key]
}

Map.prototype.set = function(position, player) {
  var key = position.toString()
  if(!this.data[key]) {
    this.data[key] = player
  }
}

Map.prototype.reset = function(position) {
  var key = position.toString()
  this.data[key] = null
}

Map.prototype.generatePosition = function() {
  var x = Math.floor(Math.random() * this.xmax)
  var y = Math.floor(Math.random() * this.ymax)
  var result = new Position(x, y)
  while(this.data[result.toString()]) {
    result.x = Math.floor(Math.random() * this.xmax)
    result.y = Math.floor(Math.random() * this.ymax)
  }
  return result
}

module.exports  = Map
