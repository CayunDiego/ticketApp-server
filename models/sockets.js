const TicketList = require("./ticket-list")

class Sockets {

  constructor( io ) {
    this.io = io

    //crear una instancia de nuestro ticketList
    this.ticketList = new TicketList()

    this.socketEvents()
  }

  socketEvents() {
    //On connection
    this.io.on('connection', ( socket ) => {
      console.log('Cliente conectado');

      socket.on('request-ticket', ( _, callback) => {
        const newTicket = this.ticketList.createTicket()
        callback( newTicket )
      })

      socket.on('next-ticket-to-work', ( user, callback ) => {
        const { agent, desk } = user
        const yourTicket = this.ticketList.assignTicket( agent, desk)
        callback(yourTicket)

        this.io.emit('ticket-assigned', this.ticketList.lastTickets)
      })

    })
  }

}

module.exports = Sockets;