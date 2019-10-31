import "babel-polyfill"
import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import store from "@/store"
import { AUTH } from "@/firebase"
import p from "@/profile"

// styles
import "@/assets/vendors/core/core.css"
import "@/assets/fonts/feather-font/css/iconfont.css"
import "@/assets/css/demo_1/style.css"

AUTH.onAuthStateChanged(async user => {
  if (user) {
    const profile = await p.getByUID(user.uid)
    if (! profile) {
      return AUTH.signOut()
    }
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