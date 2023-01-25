export const APIModule = {
  namespaced: true,
  state: () => ({
    socket: null,
    authenticated: false,
    user: null
  }),
  mutations: {
    setSocket (state, socket) {
      state.socket = socket
    },
    setUser (state, user) {
      state.authenticated = user != null
      state.user = user
    }
  },
  actions: {
    signUp ({ state }, email) {
      state.socket.signChallenge({ email })
    }
  }
}
