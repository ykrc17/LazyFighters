var app = require("./app")
var server = require("http").createServer(app)
var socketServer = require("./server/socket-server")(server)

server.listen("8080")
