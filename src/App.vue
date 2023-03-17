<template>
  <v-app v-if="!$store.state.api.authenticated">
    <v-main v-if="initialized">
      <SignUpForm v-if="requiresUserInfo" />
    </v-main>

    <v-main v-else>
      <v-btn outlined @click="loadArcana" class="ml-1">Load via Arcana Auth</v-btn>
      <v-btn outlined @click="loadLocally" class="ml-2">Load via your local wallet</v-btn>
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
    },
    async load (provider) {
      const ws = await (new WebSocketConn().initialize(provider))
      this.$store.commit('api/setSocket', ws)

      ws.emitter.on(EVENT_INITIALIZATION, ({ user_found: userFound }) => {
        this.initialized = true
        this.requiresUserInfo = !userFound
      })
      ws.emitter.on(EVENT_WELCOME, (data) => {
        this.$store.commit('api/setUser', data.user)
      })
    },
    loadLocally () {
      return this.load(window.ethereum)
    },
    async loadArcana () {
      const ÃP = await import('@arcana/auth')
      const ap = new ÃP.AuthProvider(process.env.VUE_APP_ARCANA_APP_ID, {
        alwaysVisible: true,
        debug: false,
        theme: 'light'
      })
      await ap.init()
      await ap.connect()
      return this.load(ap.provider)
    }
  },
  mounted () {
    this.initialize()
  }
}
</script>
