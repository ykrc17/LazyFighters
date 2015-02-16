var map = function() {
  this.data = []
}

map.prototype.getCount = function(position) {
  var key = position.toString()
  this.check(key)
  return this.data[key].length
}

map.prototype.add = function(position, player) {
  var key = position.toString()
  this.check(key)
  this.data[key].push(player)

  console.log("map.js: player added to ", key)
  console.log("map.js: " + key + " now has " + this.getCount(position) + " people")
}

map.prototype.remove = function(position, player) {
  var key = position.toString()
  this.check(key)
  for(var i = 0; i < this.data[key].length; i++) {
    if(this.data[key][i] === player) {
      this.data[key].splice(i, 1)
      break
    }
  }

  console.log("map.js: player removed from ", position.toString())
  console.log("map.js: " + key + " now has " + this.getCount(position) + " people")
}

map.prototype.check = function(key) {
  if(!this.data[key]) {
    this.data[key] = []
  }
}

var createMap = function() {
  return new map()
}

module.exports = createMap
