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
  this.progress = null
  this.progressMax = null

  // character data
  this.attr = new CharacterAttr()
  this.hp = this.attr.hpMax
}

Character.prototype.on = function(event, callback) {
  this.fn[event] = callback
}

Character.prototype.call = function(event, data) {
  if(!this.fn[event]) {
    this.fn[event] = function(){}
  }
  this.fn[event](data)
}

Character.prototype.move = function() {
  if(!this.targetPosition) {
    this.call('log', "我需要一个目标")
    return
  }
  if(this.map.get(this.targetPosition)) {
    this.call('log', "该位置已被人占领")
    return
  }
  this.setStatus("moving")
  this.progress = 0
  this.progressMax = constants.distance
}

Character.prototype.moveUpdate = function() {
  if(this.map.get(this.targetPosition)) {
    this.setStatus("idle")
    this.call('log', "该位置已被人占领")
    return
  }

  this.progress += this.attr.spd / constants.fps
  if(this.progress >= this.progressMax) {
    this.moveFinish();
  }
}

Character.prototype.moveFinish = function() {
  this.progress = this.progressMax

  this.map.reset(this.position)
  this.position = this.targetPosition
  this.map.set(this.targetPosition, this)

  this.targetPosition = null
  this.setStatus("idle")
  this.call('positionChange', this.position.toJSON())
  this.call('log', "玩家 " + this.id + " 到达 " + this.position.toString())
  this.targetPosition = null
  this.call('log', "目标重置")
}

Character.prototype.attack = function() {
  if(!this.targetPosition) {
    this.call('log', "我需要一个目标")
    return
  }

  // attack init
  this.setStatus("attacking")
  this.progress = 0
  this.progressMax = this.attr.atkCost
}

Character.prototype.attackUpdate = function() {
  this.progress += this.attr.atkSpd / constants.fps
  if(this.progress >= this.progressMax) {
    this.progress = this.progressMax

    var victim = this.map.get(this.targetPosition)
    if(victim) {
      this.call('log', "对 " + victim.id + " 造成 " + this.attr.atk + " 点伤害")
      victim.damage(this.attr.atk)
      this.setStatus('idle')
    }
    else {
      this.call('log', "未命中")
      this.setStatus('idle')
    }
  }
}

Character.prototype.damage = function(dmg) {
  this.hp -= dmg
  this.call('log', "受到 " + dmg + " 点伤害")
  if(this.hp <= 0) {
    this.hp = 0
  }
  if(this.hp == 0) {
    this.setStatus('dead')
    this.call('log', "你挂了")
  }
}

Character.prototype.setTarget = function(x, y) {
  var target = new Position(x, y)
  if(!this.map.contains(target)) {
    this.call("log", "目标超出边界")
    return
  }

  this.targetPosition = target
  this.call('log', "选择 " + target.toString() + " 为目标")
  this.updateMap()
}

Character.prototype.setStatus = function(status) {
  if(this.status == status) {
    return
  }
  this.status = status
  this.call('statusChange', this.getStatusData())
  this.call('log', "status set to `" + status + "`")
}

Character.prototype.getProgressData = function() {
  return Math.floor(this.progress / this.progressMax * 100)
}

Character.prototype.getStatusData = function() {
  var result = {}
  switch(this.status) {
    case 'idle':
      result.action = false
      break
    case 'moving':
      result.action = true
      result.detail = '移动至 ' + this.targetPosition.toString()
      break
    case 'attacking':
      result.action = true
      result.detail = '攻击' + this.targetPosition.toString()
      break
    case 'dead':
      result.action = false
      break
  }
  return result
}

Character.prototype.getMapData = function() {
  return this.map.getMapData(this.position, constants.sight, this.targetPosition)
}

Character.prototype.updateMap = function() {
  this.call("mapChange", this.getMapData())
}

Character.prototype.update = function() {
  if(this.hp < this.attr.hpMax) {
    this.hp += this.attr.hpRegen / constants.fps
    if(this.hp > this.attr.hpMax) {
      this.hp = this.attr.hpMax
    }
  }
  switch(this.status) {
    case "moving":
      this.moveUpdate()
      break
    case "attacking":
      this.attackUpdate()
      break
  }
}

module.exports = Character
