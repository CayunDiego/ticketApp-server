//Servidor de Express
const express = require('express')
//Servidor de Sockets
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Sockets = require('./sockets')
const cors = require('cors')

class Server {

  constructor() {
    this.app = express()
    this.port = process.env.PORT

    //Http server
    this.server = http.createServer( this.app )
    //Configuraciones de sockets
    this.io = socketio( this.server, { /*configuraciones*/} )

    //Inicializar sockets
    this.sockets = new Sockets( this.io )
  }

  middlewares() {
    //Desplegar directorio público
    this.app.use( express.static( path.resolve( __dirname, '../public') ) )

    //config por defecto de CORS
    this.app.use( cors() )

    //get de los últimos tickets
    this.app.get('/last', (req, res) => {
      res.json({
        ok: true,
        last: this.sockets.ticketList.lastTickets
      })
    })
  }

  // configSockets() {
  //   new Sockets( this.io )
  // }

  execute() {
    //Inicializar Middlewares
    this.middlewares()

    //Inicializar sockets
    // this.configSockets()

    //Inicializar Server
    this.server.listen( this.port, () => {
      console.log('Server corriendo en puerto:', this.port)
    })
  }

}

module.exports = Server;