/*
  character
    存放角色的数据
  参数:
    map
      角色所在地图
*/
var constants = require('./constants')
var Position = require('./models/position')
var CharacterAttr = require("./models/characterAttr")

var Character = function(map) {
  // private
  this.map = map
  this.fn = []

  // public
  this.position = map.generatePosition()
  map.set(this.position, this)
  this.status = "idle"
  this.targetPosition = null
  this.action = null

  // character data
  this.attr = new CharacterAttr()
  this.hp = this.attr.hpMax
}

Character.prototype.on = function(event, callback) {
  this.fn[event] = callback
}

Character.prototype.emit = function(event, data) {
  if(!this.fn[event]) {
    this.fn[event] = function(){}
  }
  this.fn[event](data)
}

Character.prototype.move = function() {
  var Move = require("./actions/move")
  this.action = new Move(this, constants.distance, this.targetPosition)
  this.action.start()
}

Character.prototype.attack = function() {
  var Attack = require("./actions/attack")
  this.action = new Attack(this, this.attr.atkCost, this.targetPosition)
  this.action.start()
}

Character.prototype.damage = function(character, dmg) {
  this.hp -= dmg
  this.emit('log', "受到来自 `" + character.name + "` 的 " + dmg + " 点伤害")
  if(this.hp <= 0) {
    this.hp = 0
  }
  if(this.hp == 0) {
    this.setStatus('dead')
    this.emit('log', "你挂了")
  }
}

Character.prototype.setTarget = function(x, y) {
  var target = new Position(x, y)
  if(!this.map.contains(target)) {
    this.emit("log", "目标超出边界")
    this.targetPosition = null
    return
  }

  this.targetPosition = target
  this.emit('log', "选择 " + target.toString() + " 为目标")
  this.updateMap()
}

Character.prototype.setStatus = function(status) {
  if(this.status == status) {
    return
  }
  this.status = status
  this.emit('statusChange', this.getStatusData())
  this.emit('log', "status set to `" + status + "`")
}

Character.prototype.getProgressData = function() {
  if(this.status == "action") {
    return Math.floor(this.action.progress / this.action.progressMax * 100)
  }
  else {
    return null
  }
}

Character.prototype.getStatusData = function() {
  var result = {status: this.status}
  if(this.status == "action") {
    result.detail = this.action.name + " " + this.targetPosition ? this.targetPosition.toString() : ""
  }
  return result
}

Character.prototype.getMapData = function() {
  return this.map.getMapData(this.position, constants.sight, this.targetPosition)
}

Character.prototype.updateMap = function() {
  this.emit("mapChange", this.getMapData())
}

Character.prototype.update = function() {
  if(this.hp < this.attr.hpMax) {
    this.hp += this.attr.hpRegen / constants.fps
    if(this.hp > this.attr.hpMax) {
      this.hp = this.attr.hpMax
    }
  }
  switch(this.status) {
    case "action":
      this.action.update()
      break
  }
}

module.exports = Character
