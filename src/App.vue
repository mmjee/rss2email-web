<template>
  <v-app v-if="!$store.state.api.authenticated">
    <v-main v-if="initialized">
      <SignUpForm v-if="requiresUserInfo" />
    </v-main>

    <v-main v-else>
      <v-progress-linear />
    </v-main>
  </v-app>

  <v-app v-else>
    <v-app-bar app color="primary" dark>
      <v-btn outlined link to="/">
        Subscription List
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SignUpForm from '@/views/SignUpForm'
import { WebSocketConn } from '@/store/conn'
import { EVENT_INITIALIZATION, EVENT_WELCOME } from '@/store/constants'

export default {
  name: 'App',

  components: {
    SignUpForm
  },
  data: () => ({
    initialized: false,
    requiresUserInfo: false
  }),
  methods: {
    async initialize () {
      let locale = window.localStorage.getItem('LOCALE')
      if (locale == null) {
        locale = 'en-GB-oxendict'
      }
      this.$store.commit('i18n/updateState', locale)

      const ws = await (new WebSocketConn().initialize(window.ethereum))
      this.$store.commit('api/setSocket', ws)

      ws.emitter.on(EVENT_INITIALIZATION, ({ user_found: userFound }) => {
        this.initialized = true
        this.requiresUserInfo = !userFound
      })
      ws.emitter.on(EVENT_WELCOME, (data) => {
        this.$store.commit('api/setUser', data.user)
      })
    }
  },
  mounted () {
    this.initialize()
  }
}
</script>
