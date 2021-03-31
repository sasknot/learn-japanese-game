<template>
  <div>
    <section id="login" v-if="!loggedIn">
      <form @submit.prevent="login">
        <input autocomplete="off" v-model="username">
        <button type="submit">Send</button>
      </form>
    </section>

    <section id="lobby" v-if="loggedIn">
      <div id="panel">
        <ul id="lobby-users">
          <li v-for="(player, index) in players" :key="index">
            {{ player.name }}
          </li>
        </ul>
        <ul id="lobby-messages">
          <li v-for="(message, index) in messages" :key="index">
            {{ message }}
          </li>
        </ul>
      </div>
      <form @submit.prevent="sendNewMessage">
        <input autocomplete="off" v-model="newMessage">
        <button type="submit">Send</button>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'

interface Player {
  id: string
  name: string
}

export default defineComponent({
  name: 'App',
  // components: {
  //   HelloWorld
  // },

  data () {
    return {
      loggedIn: false,
      username: '',
      newMessage: '',
      messages: [] as string[],
      players: [] as Player[]
    }
  },

  methods: {
    addLobbyUser (user: Player) {
      this.players.push(user)
    },

    addLobbyMessage (message: string) {
      const formattedMessage = message.replace(/(<([^>]+)>)/gi, '')

      this.messages.push(formattedMessage)
    },

    login () {
      if (this.username) {
        this.$socket.emit('join', this.username)
        this.addLobbyUser({ id: 'myself', name: this.username })
        this.username = ''
        this.loggedIn = true
      }
    },

    sendNewMessage () {
      this.$socket.emit('message', this.newMessage)
      this.newMessage = ''
    }
  },

  created () {
    this.$socket.on('user list', (response: Player[]) => {
      response.forEach(this.addLobbyUser)
    })

    this.$socket.on('user joined', (response: Player) => {
      this.addLobbyMessage(`${response.name} has joined the game`)
      this.addLobbyUser(response)
    })

    this.$socket.on('user left', (response: Player) => {
      this.players = this.players.filter((current: Player) => {
        return current.id !== response.id
      })
      this.addLobbyMessage(`${response.name} has left the game`)
    })

    this.$socket.on('message sent', (response: string) => {
      this.addLobbyMessage(response)
    })
  },

  mounted () {
    this.$socket.connect()
  }
})
</script>
