import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  baseURL: null,
  roles: {},
  user: null
}

const mutations = {
  setBaseURL(state, string) {
    state.baseURL = string
  },
  setRoles(state, payload) {
    state.roles = payload
  },
  setUser(state, payload = null) {
    state.user = payload ? {
      ...state.user,
      ...payload
    } : null
  }
}

export default new Vuex.Store({
  state,
  mutations
})