/*
  Action类
    表示角色能进行的动作
    该动作不能设定动作目标
  参数：
    * character
      动作实行者
    * progressMax
      动作最大持续时间
*/
var Action = function(character) {
  this.character = character
  this.name = "默认动作"
  this.progress = null
  this.progressMax = null
}

Action.prototype.start = function() {
  this.progress = 0
  this.progressMax = 100
}

Action.prototype.update = function() {

}

Action.prototype.finish = function() {
  this.progress = this.progressMax
}

module.exports = Action
