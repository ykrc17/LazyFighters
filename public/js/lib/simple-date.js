var SimpleDate = function() {
  this.date = new Date()
}

SimpleDate.prototype.toString = function() {
  return this.date.getHours() + ":" + this.date.getMinutes() + ":" + this.date.getSeconds()
}
