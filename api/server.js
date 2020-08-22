import { createServer } from 'http'
import app from './app'

const server = createServer(app)

app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 3000)
app.installSocket(server)

server.listen(app.get('port'), app.get('host'), () => {
  console.log(`API listening on: http://${app.get('host')}:${app.get('port')}`)
})
