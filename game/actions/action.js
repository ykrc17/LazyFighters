var Action = function(character, progressMax) {
  this.character = character
  this.progress = 0
  this.progressMax = progressMax
  this.name = "默认动作"
}

Action.prototype.start = function() {

}

Action.prototype.update = function() {

}

Action.prototype.finish = function() {

}

module.exports = Action
