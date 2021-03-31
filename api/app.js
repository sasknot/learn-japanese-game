import { createServer } from 'http'
import socketIO from 'socket.io'

const server = createServer()
const io = new socketIO.Server(server, {
  path: '/',
  serveClient: false,
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
})

let usersConnected = []

io.on('connect', (socket) => {
  socket.emit('user list', usersConnected)

  socket.on('disconnect', () => {
    const userDisconnected = usersConnected.find((item) => item.id === socket.id)
    usersConnected = usersConnected.filter((item) => item.id !== socket.id)

    socket.broadcast.emit('user left', {
      ...userDisconnected,
      count: usersConnected.length
    })
  })

  socket.on('join', (name) => {
    usersConnected.push({ id: socket.id, name })
    socket.broadcast.emit('user joined', {
      id: socket.id,
      name: name,
      count: usersConnected.length
    })
  })

  socket.on('message', (message) => {
    io.emit('message sent', message)
  })
})

server.listen(3000, () => {
  console.info('API listening at http://localhost:3000')
})
