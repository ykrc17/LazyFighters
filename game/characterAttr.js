module.exports = function() {
  return new characterAttr()
}

var characterAttr = function() {
  this.atk = 10
  this.spd = 20

  this.maxHp = 100
  this.hp = this.maxHp
  this.atkCost = 50
}
