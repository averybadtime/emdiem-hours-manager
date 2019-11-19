import "babel-polyfill"
import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import store from "@/store"
import { AUTH } from "@/firebase"
import p from "@/profile"

// Vendors
  // VueSweetalert2
  import VueSweetalert2 from "vue-sweetalert2"
  Vue.use(VueSweetalert2)
  // moment.js
  import moment from "moment"
  // vue-currency-filter
  import VueCurrencyFilter from "vue-currency-filter"

// styles
import "@/assets/vendors/core/core.css"
import "@/assets/vendors/sweetalert2/sweetalert2.min.css"
import "@/assets/fonts/feather-font/css/iconfont.css"
import "@/assets/css/demo_1/style.css"

Vue.use(VueCurrencyFilter, {
  symbol            : "$",
  thousandsSeparator: ".",
  fractionCount     : 0,
  fractionSeparator : ",",
  symbolPosition    : "front",
  symbolSpacing     : true
})

Vue.filter("role", function(value) {
  switch (value) {
    case "_SUPER" : return "Link!"
    case "_PM"    : return "Project Manager"
    case "_DEV"   : return "Dev"
    case "_CLIENT": return "Cliente"
         default  : return "Desconocido"
  }
})

Vue.filter("status", function(value) {
  switch (value) {
    case "_OFF" : return "Inactivo"
    case "_DEL" : return "Eliminado"
         default: return "Activo"
  }
})

Vue.filter("date", function(value, format) {
  return format ?
    moment.unix(value).format(format) :
    moment.unix(value).format("DD/MM/YYYY")
})

let app

AUTH.onAuthStateChanged(async user => {
  if (user) {
    const profile = await p.getByUID(user.uid)
    if (! profile) {
      return AUTH.signOut()
    }
    profile.uid = user.uid
    store.commit("setUser", profile)
  } else {
    store.commit("setUser")
  }

  router.replace(user ? "/" : "/login")

  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app")
  }
})