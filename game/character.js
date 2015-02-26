module.exports = function(map, log) {
  return new character(map, log)
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
  this.next = null
  this.status = "idle"
  this.process = null
  this.processMax = null
  this.target = null

  // character data
  this.attr = require('./characterAttr')()
  this.hp = this.attr.hpMax

  // private
  this.map = map
  this.fn = []
  this.fn['log'] = function(){}
  this.fn['positionChange'] = function(){}
  this.fn['attrChange'] = function(){}
}

character.prototype.on = function(event, callback) {
  this.fn[event] = callback
}

character.prototype.move = function(direction, distance) {
  switch(direction) {
    case 'left':
      this.next = this.position.left()
      break
    case 'right':
      this.next = this.position.right()
      break
    case 'up':
      this.next = this.position.up()
      break
    case 'down':
      this.next = this.position.down()
      break
  }
  if(this.map.get(this.next)) {
    this.fn['log']("该位置已被人占领")
    return
  }
  this.setStatus("moving")
  this.process = 0
  this.processMax = distance
}

character.prototype.moveUpdate = function(shift) {
  if(this.map.get(this.next)) {
    this.setStatus("idle")
    this.fn['log']("该位置已被人占领")
    return
  }

  this.process += shift
  if(this.process >= this.processMax) {
    this.process = this.processMax

    this.map.remove(this.position)
    this.map.set(this.next, this)

    this.position = this.next
    this.next = null
    this.setStatus("idle")
    this.fn['positionChange'](this.position)
    this.fn['log']("玩家 " + this.id + " 到达 " + this.position.toString())
    this.target = null
    this.fn['log']("目标重置")
  }
}

character.prototype.attack = function() {
  if(!this.target) {
    this.fn['log']("我需要一个目标")
    return
  }
  this.setStatus("attacking")
  this.process = 0
  this.processMax = this.attr.atkCost
}

character.prototype.attackUpdate = function(offset) {
  this.process += offset
  if(this.process >= this.processMax) {
    this.process = this.processMax

    var victim = this.map.get(this.target)
    if(victim) {
      this.fn['log']("对 " + victim.id + " 造成 " + this.attr.atk + " 点伤害")
      victim.damage(this.attr.atk)
      this.setStatus('idle')
    }
    else {
      this.fn['log']("未命中")
      this.setStatus('idle')
    }
  }
}

character.prototype.damage = function(dmg) {
  this.hp -= dmg
  this.fn['log']("受到 " + dmg + " 点伤害")
  if(this.hp <= 0) {
    this.hp = 0
  }
  if(this.hp == 0) {
    this.setStatus('dead')
    this.fn['log']("你挂了")
  }
}

character.prototype.setTarget = function(x, y) {
  var targetPosition = require('./model/position')(x, y)
  if(!this.target || this.target.toString() != targetPosition.toString()) {
    this.target = targetPosition
    this.fn['log']("选择 " + targetPosition.toString() + " 为目标")
    if(this.status == "attacking") {
      setStatus("idle")
      log("停止攻击")
    }
  }
}

character.prototype.setStatus = function(status) {
  if(this.status == status) {
    return
  }
  this.status = status
  this.fn['log']("status set to `" + status + "`")
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
      this.moveUpdate(this.attr.spd / constants.fps)
      break
    case "attacking":
      this.attackUpdate(this.attr.atkSpd / constants.fps)
      break
  }
}
