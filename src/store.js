import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  baseURL: null,
  clients: [],
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
  pushClient(state, payload) {
    state.clients.push(payload)
  },
  updateClient(state, payload) {
    const index = state.clients.findIndex(x => x.key == payload.key)
    if (index > -1) {
      state.clients[index] = payload
    }
  },
  spliceClient(state, ClientKey) {
    const index = state.clients.findIndex(x => x.key == ClientKey)
    if (index > -1) {
      state.clients.splice(index, 1)
    }
  },
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