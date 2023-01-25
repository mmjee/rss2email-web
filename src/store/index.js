import Vue from 'vue'
import Vuex from 'vuex'

import { APIModule } from '@/store/api'
import { i18nStore } from '@/store/i18n'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    api: APIModule,
    i18n: i18nStore
  }
})
