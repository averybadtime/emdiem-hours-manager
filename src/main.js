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

// styles
import "@/assets/vendors/core/core.css"
import "@/assets/vendors/sweetalert2/sweetalert2.min.css"
import "@/assets/fonts/feather-font/css/iconfont.css"
import "@/assets/css/demo_1/style.css"


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

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app")
})