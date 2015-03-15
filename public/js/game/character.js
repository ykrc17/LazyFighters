var loadCharacter = function(socket) {

  socket.on("attrChange", function(data) {
    // 游戏页面
    $("#hp-max").html(data.hpMax)
    $("#hp-regen").html(data.hpRegen)

    // 角色页面
    $("#character-hp-max").html(data.hpMax)
    $("#character-hp-regen").html(data.hpRegen)
    $("#character-atk").html(data.atk)
    $("#character-atk-spd").html(data.atkSpd)
    $("#character-atk-cost").html(data.atkCost)
    $("#character-mov-spd").html(data.movSpd)
  })
}
