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
var constants = require("./constants")

var Map = function(xmax, ymax) {
  if(!xmax || !ymax) {
    console.log("map.js : Alert - not enough parameters")
  }
  this.data = []
  this.xmax = Math.floor(xmax)
  this.ymax = Math.floor(ymax)
}

Map.prototype.get = function(position) {
  var key = position.toString()
  return this.data[key]
}

Map.prototype.set = function(position, player) {
  var key = position.toString()
  if(!this.data[key]) {
    this.data[key] = player
    this.mapUpdate(position)
  }
}

Map.prototype.reset = function(position) {
  var key = position.toString()
  this.data[key] = null
  this.mapUpdate(position)
}

Map.prototype.mapUpdate = function(position) {
  var sight = constants.sight
  if(!position) {
    return
  }
  for(var iy=-sight; iy<=sight; iy++) {
    for(var ix=-sight; ix<=sight; ix++) {
      var now = this.get(new Position(position.x+ix, position.y+iy))
      if(now) {
        now.updateMap()
      }
    }
  }
}

Map.prototype.contains = function(position) {
  if(position.x < 0 || position.y < 0 || position.x >= this.xmax || position.y >= this.ymax) {
    return false
  }
  return true
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

Map.prototype.getMapData = function(position, sight, target) {
  var result = []
  for(var i = -sight; i<=sight; i++) {
    for(var j = -sight; j<=sight; j++) {
      var now = new Position(position.x+j, position.y+i)
      if(this.contains(now)) {
        if(now.equals(position)) {
          result.push("player")
          continue
        }
        if(this.get(now)) {
          result.push("enemy")
          continue
        }
        if(now.equals(target)) {
          result.push("target")
          continue
        }
        result.push("default")
      }
      else {
        result.push("invalid")
      }
    }
  }
  return result
}

module.exports  = Map
