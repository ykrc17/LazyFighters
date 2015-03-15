var constants = require("../constants")
var ActionTargeted = require("./action-targeted")

/*
  Move:
    progressMax: distance
    targetPosition: targetPosition
*/

var Move = function(character) {
  ActionTargeted.call(this, character)
  this.name = "移动"
}

Move.prototype = new ActionTargeted()
Move.prototype.constructor = Move

Move.prototype.start = function() {
  this.progress = 0
  this.progressMax = constants.distance
  this.targetPosition = this.character.targetPosition

  if(!this.targetPosition) {
    this.character.emit("log", "`你` 需要一个目标")
    return
  }
  if(this.character.map.get(this.targetPosition)) {
    if(this.character.map.get(this.targetPosition) === this.character) {
      this.character.emit("log", "`你` 已到达该位置")
    }
    else {
      this.character.emit("log", "该位置已被人占领")
    }
    return
  }
  this.character.setStatus("action")
}

Move.prototype.update = function() {
  if(this.character.map.get(this.targetPosition)) {
    this.character.setStatus("idle")
    this.character.emit("log", "该位置已被人占领")
    return
  }

  this.progress += this.character.attr.movSpd / constants.fps
  if(this.progress >= this.progressMax) {
    this.finish();
  }
}

Move.prototype.finish = function() {
  this.character.progress = this.character.progressMax

  this.character.map.reset(this.character.position)
  this.character.position = this.targetPosition
  this.character.map.set(this.targetPosition, this.character)

  this.character.setStatus("idle")
  this.character.emit("positionChange", this.character.position.toJSON())
  this.character.emit("log", "`你` 到达位置 " + this.character.position.toString())
}

module.exports = Move
