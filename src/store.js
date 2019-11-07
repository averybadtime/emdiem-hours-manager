import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  baseURL: null,
  roles: {},
  storyStates: {
    "_PENDING"    : "Pendiente",
    "_IN_PROGRESS": "En progreso",
    "_QA"         : "Q&A",
    "_DONE"       : "Completado",
    "_STUCK"      : "Atascado"
  },
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