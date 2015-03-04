var constants = require("../constants")
var Action = require("./action")
var Move = function(character, progressMax) {
  Action.call(this, character, progressMax)
  this.name = "移动"
}

Move.prototype = new Action()
Move.prototype.constructor = Move

Move.prototype.start = function() {
  if(!this.character.targetPosition) {
    this.character.emit('log', "我需要一个目标")
    return
  }
  if(this.character.map.get(this.character.targetPosition)) {
    this.character.emit('log', "该位置已被人占领")
    return
  }
  this.character.setStatus("action")
}

Move.prototype.update = function() {
  console.log(this.progress)
  if(this.character.map.get(this.character.targetPosition)) {
    this.character.setStatus("idle")
    this.character.emit('log', "该位置已被人占领")
    return
  }

  this.progress += this.character.attr.spd / constants.fps
  if(this.progress >= this.progressMax) {
    this.finish();
  }
}

Move.prototype.finish = function() {
  this.character.progress = this.character.progressMax

  this.character.map.reset(this.character.position)
  this.character.position = this.character.targetPosition
  this.character.map.set(this.character.targetPosition, this.character)

  this.character.targetPosition = null
  this.character.setStatus("idle")
  this.character.emit('positionChange', this.character.position.toJSON())
  this.character.emit('log', "玩家 " + this.character.id + " 到达 " + this.character.position.toString())
  this.character.targetPosition = null
  this.character.emit('log', "目标重置")
}

module.exports = Move
