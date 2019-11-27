const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const escapeHtml = require('escape-html') // on add le package escape qu'on a dl pour protéger notre chat

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

function sendClients(){
  const clients =[]
  const connected = io.sockets.clients().connected  // on fait un for et pas un forEach car c'est pas un array avec des auto increment mais un tableau ou on assigne à la main
  for (const index in connected) {
    const client = connected[index]
    clients.push({
      avatar: escapeHtml(client.handshake.query.avatar),
      pseudo: escapeHtml(client.handshake.query.pseudo)
    })
    console.log(clients)
  }
  io.emit('clients', clients) // on envoie la liste des clients à tous le monde à chaque fois qu'un nouveau arrive pour avoir l nouvelle liste donc io et pas socket
}

const messages = []

io.on('connection', function(socket) {

  const pseudo = escapeHtml(socket.handshake.query.pseudo).substr(0, 30)
  const avatar = escapeHtml(socket.handshake.query.avatar)

  socket.handshake.query.pseudo = pseudo
  socket.handshake.query.avatar = avatar

  console.log(`${pseudo} s'est connecté !`)

  sendClients(); // on appelle la méthode
  socket.emit('messages', messages) // socket car on envoie la liste des messages que au nouveau...

  socket.on('message', function(value){
    const data = {
      avatar:avatar,
      pseudo:pseudo,
      message:escapeHtml(value).substr(0, 1000), // on se protége des injections XSS, côté serveur, mais on peut ajouter u confort utilisateur côté client en mettant d'autres limites...
      date:Date.now()
    }
    messages.push(data)
    io.emit('message', data)

  })

  socket.on('disconnect', function () {
    console.log(`${pseudo} s'est déconnecté !`)
    sendClients(); // on renvoie la liste à chaque déconnection
  })
})

http.listen(3000, function() {
  console.log('http://localhost:3000');
})

// c'est le serveur !!!
