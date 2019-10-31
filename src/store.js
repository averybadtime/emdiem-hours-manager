import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  user: null
}

const mutations = {
  setUser(state, payload = null) {
    state.user = payload
  }
}

export default new Vuex.Store({
  state,
  mutations
})