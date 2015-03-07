var Action = require("./action")

var ActionTargeted = function(character, progressMax, targetPosition) {
  Action.call(this, character, progressMax)
  this.targetPosition = targetPosition
}

ActionTargeted.prototype = new Action()
ActionTargeted.prototype.constructor = ActionTargeted

module.exports = ActionTargeted
