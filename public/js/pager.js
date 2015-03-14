var pageNow = "game"
var changePage = function(page) {
  if(pageNow == page) {
    return
  }
  $("#" + pageNow + "-page").hide()
  $("#" + page +"-page").show()
  $("#show-" + pageNow).removeClass("active")
  $("#show-" + page).addClass("active")
  pageNow = page
}

$(function() {
  $("#show-game").click(function() {
    changePage("game")
  })

  $("#show-network").click(function() {
    changePage("network")
  })
})
