var app = require('./app')
var server = require('http').createServer(app)
var socketServer = require('./socket-server')(server)

server.listen('8080')
