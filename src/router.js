import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
Vue.use(VueRouter)
// Pages
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Users from "@/pages/Users"
import Client from "@/pages/Client"
  import ClientDashboard from "@/pages/client/Dashboard"
  import ClientStories from "@/pages/client/Stories"
  import ClientTasks from "@/pages/client/Tasks"
  import ClientTimeline from "@/pages/client/Timeline"
  import ClientAdvanced from "@/pages/client/Advanced"

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
  },
  {
    component: Users,
    name: "USERS",
    path: "/usuarios",
    meta: { requiresAuth: true }
  },
  {
    component: Client,
    path: "/cliente/:slug",
    meta: { requiresAuth: true },
    children: [
      {
        component: ClientDashboard,
        name: "CLIENT_DASHBOARD",
        path: "/"
      },
      {
        component: ClientStories,
        name: "CLIENT_STORIES",
        path: "historias"
      },
      {
        component: ClientTasks,
        name: "CLIENT_TASKS",
        path: "tareas"
      },
      {
        component: ClientTimeline,
        name: "CLIENT_TIMELINE",
        path: "actividad"
      },
      {
        component: ClientAdvanced,
        name: "CLIENT_ADVANCED",
        path: "avanzado"
      }
    ]
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