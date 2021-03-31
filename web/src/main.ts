import { io } from 'socket.io-client'
import { createApp } from 'vue'

import App from './App.vue'
import './index.css'

interface SocketPluginOptions {
  url: string,
  autoConnect: boolean
}

const socketPlugin = {
  install (app: any, options: SocketPluginOptions) {
    const { url, ...otherOptions } = options
    const socket = io(url, otherOptions)

    app.config.globalProperties.$socket = socket
  }
}
const app = createApp(App)

app.use(socketPlugin, {
  url: 'ws://localhost:3000',
  autoConnect: false
})
app.mount('#app')
