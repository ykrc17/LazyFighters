module.exports = function() {
  return new characterAttr()
}

var characterAttr = function() {
  this.atk = 10
  this.atkSpd = 30
  this.atkCost = 50

  this.spd = 1000

  this.hpMax = 100
  this.hpRegen = 1
}
