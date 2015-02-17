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
  this.remaining = null
  this.target = null

  this.attr = require('./characterAttr')()

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
  this.remaining = distance
}

character.prototype.moveUpdate = function(shift) {
  if(this.map.get(this.next)) {
    this.setStatus("idle")
    this.fn['log']("该位置已被人占领")
    return
  }

  this.remaining -= shift
  if(this.remaining <= 0) {
    this.map.remove(this.position)
    this.map.set(this.next, this)

    this.position = this.next
    this.next = null
    this.setStatus("idle")
    this.fn['positionChange'](this.position)
    this.fn['log']("character " + this.id + " has moved to position : " + this.position.toString())
  }
}

character.prototype.attack = function() {
  if(!target) {
    this.fn['log']("我需要一个目标")
  }
  setStatus("attacking")
}

character.prototype.attackUpdate = function(offset) {
  this.remaining -= offset
  if(this.remaining <= 0) {

  }
}

character.prototype.damage = function(dmg) {
  this.attr.hp -= dmg
  log("受到 " + dmg + " 点伤害")
  if(this.attr.hp <= 0) {
    setStatus('dead')
    this.attr.hp = 0
    log("你挂了")
  }
}

character.prototype.setTarget = function(x, y) {
  var targetPosition = require('./model/position')(x, y)
  if(!this.target || this.target.toString() != targetPosition.toString()) {
    this.target = targetPosition
    if(this.status == "attacking") {
      setStatus("idle")
      log("停止攻击")
    }
    this.fn['log']("选择 " + targetPosition.toString() + " 为目标")
  }
}

character.prototype.setStatus = function(status) {
  this.status = status
  this.fn['log']("status set to `" + status + "`")
}

character.prototype.update = function() {
  switch(this.status) {
    case "moving":
      this.moveUpdate(this.attr.spd / constants.fps)
      break
    case "attacking":
      this.attackUpdate(this.attr.spd / constants.fps)
      break
  }
}
