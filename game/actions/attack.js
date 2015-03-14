var constants = require("../constants")
var ActionTargeted = require("./action-targeted")

/*
  Attack:
    progressMax: atkCost
    targetPosition: targetPosition
*/

var Attack = function(character) {
  ActionTargeted.call(this, character)
  this.name = "攻击"
}

Attack.prototype = new ActionTargeted()
Attack.prototype.constructor = Attack

Attack.prototype.start = function() {
  this.progress = 0
  this.progressMax = this.character.attr.atkCost
  this.targetPosition = this.character.targetPosition

  if(!this.targetPosition) {
    this.character.emit('log', "我需要一个目标")
    return
  }

  this.character.setStatus("action")
}

Attack.prototype.update = function() {
  this.progress += this.character.attr.atkSpd / constants.fps
  if(this.progress >= this.progressMax) {
    this.finish()
  }
}

Attack.prototype.finish = function() {
  this.progress = this.progressMax

  var victim = this.character.map.get(this.targetPosition)
  if(victim) {
    victim.damage(this.character, this.character.attr.atk)
    this.character.emit("log", "`你` 对 `" + victim.name + "` 造成 " + this.character.attr.atk + " 点伤害")
    this.character.setStatus('idle')
  }
  else {
    this.character.emit('log', "目标地点没有人，打空了")
    this.character.setStatus('idle')
  }
}

module.exports = Attack
