const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', function(socket) {

  const pseudo = socket.handshake.query.pseudo
  const avatar = socket.handshake.query.avatar

  console.log(`${pseudo} s'est connecté !`)
  
  socket.on('disconnect', function () {
    console.log(`${pseudo} s'est déconnecté !`)
  })
})

http.listen(3000, function() {
  console.log('http://localhost:3000');
})
