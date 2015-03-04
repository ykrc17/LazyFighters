var constants = require("../constants")
var Action = require("./action")
var Attack = function(character, progressMax) {
  Action.call(this, character, progressMax)
  this.name = "攻击"
}

Attack.prototype = new Action()
Attack.prototype.constructor = Attack

Attack.prototype.start = function() {
  if(!this.character.targetPosition) {
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

  var victim = this.character.map.get(this.character.targetPosition)
  if(victim) {
    this.character.emit('log', "对 " + victim.id + " 造成 " + this.character.attr.atk + " 点伤害")
    victim.damage(this.character.attr.atk)
    this.character.setStatus('idle')
  }
  else {
    this.character.emit('log', "未命中")
    this.character.setStatus('idle')
  }
}

module.exports = Attack
