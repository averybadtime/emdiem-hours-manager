export default {
  install(Vue) {
    Vue.prototype.$isAdmin = function() {
      return this.$store.state.user.role == "_SUPER"
    }
    Vue.prototype.$isPM = function() {
      return this.$store.state.user.role == "_PM"
    }
    Vue.prototype.$isDev = function() {
      return this.$store.state.user.role == "_DEV"
    }
    Vue.prototype.$isClient = function() {
      return this.$store.state.user.role == "_CLIENT"
    }
  }
}