import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
Vue.use(VueRouter)
// Pages
import Home from "@/pages/Home"
import Login from "@/pages/Login"

const routes = [
  {
    component: Login,
    name: "LOGIN",
    path: "/login"
  },
  {
    component: Home,
    name: "HOME",
    path: "/",
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: "history",
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  const { user } = store.state
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (! user && requiresAuth) next("/login")
  else if (user && ! requiresAuth) next("/")
  else next()
})

export default router