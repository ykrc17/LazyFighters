module.exports = function(map) {
  return new character(map)
}

var constants = require('./constants')
/*
  character
    存放角色的数据
  参数:
    map
      角色所在地图
*/
var character = function(map) {
  // public
  this.position = map.generatePosition()
  this.status = "idle"
  this.moveTarget = null
  this.attackTarget = null
  this.process = null
  this.processMax = null

  // character data
  this.attr = require('./characterAttr')()
  this.hp = this.attr.hpMax

  // private
  this.map = map
  this.fn = []
}

character.prototype.on = function(event, callback) {
  this.fn[event] = callback
}

character.prototype.call = function(event, data) {
  if(!this.fn[event]) {
    this.fn[event] = function(){}
  }
  this.fn[event](data)
}

character.prototype.move = function(direction, distance) {
  switch(direction) {
    case 'left':
      this.moveTarget = this.position.left()
      break
    case 'right':
      this.moveTarget = this.position.right()
      break
    case 'up':
      this.moveTarget = this.position.up()
      break
    case 'down':
      this.moveTarget = this.position.down()
      break
  }
  if(this.map.get(this.moveTarget)) {
    this.call('log', "该位置已被人占领")
    return
  }
  this.setStatus("moving")
  this.process = 0
  this.processMax = distance
}

character.prototype.moveUpdate = function() {
  if(this.map.get(this.moveTarget)) {
    this.setStatus("idle")
    this.call('log', "该位置已被人占领")
    return
  }

  this.process += this.attr.spd / constants.fps
  if(this.process >= this.processMax) {
    this.process = this.processMax

    this.map.remove(this.position)
    this.map.set(this.moveTarget, this)

    this.position = this.moveTarget
    this.moveTarget = null
    this.setStatus("idle")
    this.call('positionChange', this.position.toJSON())
    this.call('log', "玩家 " + this.id + " 到达 " + this.position.toString())
    this.attackTarget = null
    this.call('log', "目标重置")
  }
}

character.prototype.attack = function() {
  if(!this.attackTarget) {
    this.call('log', "我需要一个目标")
    return
  }

  // attack init
  this.setStatus("attacking")
  this.process = 0
  this.processMax = this.attr.atkCost
}

character.prototype.attackUpdate = function() {
  this.process += this.attr.atkSpd / constants.fps
  if(this.process >= this.processMax) {
    this.process = this.processMax

    var victim = this.map.get(this.attackTarget)
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

character.prototype.damage = function(dmg) {
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

character.prototype.setTarget = function(x, y) {
  var targetPosition = require('./model/position')(x, y)
  if(!this.attackTarget || !this.attackTarget.equals(targetPosition)) {
    this.attackTarget = targetPosition
    this.call('log', "选择 " + targetPosition.toString() + " 为目标")
    if(this.status == "attacking") {
      setStatus("idle")
      this.call('log', "停止攻击")
    }
  }
}

character.prototype.setStatus = function(status) {
  if(this.status == status) {
    return
  }
  this.status = status
  this.call('statusChange', this.getStatusData())
  this.call('log', "status set to `" + status + "`")
}

character.prototype.getStatusData = function() {
  var result = {}
  switch(this.status) {
    case 'idle':
      result.action = false
      break
    case 'moving':
      result.action = true
      result.detail = '移动至 ' + this.moveTarget.toString()
      break
    case 'attacking':
      result.action = true
      result.detail = '攻击' + this.attackTarget.toString()
      break
    case 'dead':
      result.action = false
      break
  }
  return result
}

character.prototype.update = function() {
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
