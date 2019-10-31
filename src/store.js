import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  user: null
}

const mutations = {
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