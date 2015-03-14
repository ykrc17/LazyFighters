var Action = require("./action")

var ActionTargeted = function(character) {
  Action.call(this, character)
}

ActionTargeted.prototype = new Action()
ActionTargeted.prototype.constructor = ActionTargeted

ActionTargeted.prototype.start = function() {
  this.progress = 0
  this.progressMax = this.character.attr.attackMax
  this.targetPosition = this.character.targetPosition
}

module.exports = ActionTargeted
