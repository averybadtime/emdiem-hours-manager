<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-brand">
        Emdiem<span>HM</span>
      </router-link>
      <div class="sidebar-toggler active">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="sidebar-body">
      <ul class="nav">
        <li class="nav-item nav-category">Administrador</li>
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="link-icon" data-feather="compass"></i>
            <span class="link-title">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item nav-category">Gestión</li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="collapse" href="#emails" role="button" aria-expanded="false" aria-controls="emails">
            <i class="link-icon" data-feather="briefcase"></i>
            <span class="link-title">Proyectos</span>
            <i class="link-arrow" data-feather="chevron-down"></i>
          </a>
          <div class="collapse" id="emails">
            <ul class="nav sub-menu">
              <li v-for="(client, index) in clients"
                :key="index"
                class="nav-item">
                <router-link :to="`/cliente/${ client.slug }`"
                  class="nav-link"
                  :class="{ active: slug == client.slug }">
                  {{ client.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="$isAdmin()" class="nav-item">
          <router-link to="/usuarios" class="nav-link">
            <i class="link-icon" data-feather="users"></i>
            <span class="link-title">Usuarios</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
  import { DATABASE } from "@/firebase"
  import { ClientsMixin } from "@/mixins/clients"
  import PerfectScrollbar from "perfect-scrollbar"
  export default {
    mixins: [
      ClientsMixin
    ],
    data() {
      return {
        clientsOnChildAdded: null,
        clientsOnChildChanged: null,
        clientsOnChildRemoved: null,
        clientsRef: null,
        role: this.$store.state.user.role,
        rootRef: DATABASE.ref()
      }
    },
    computed: {
      clients() {
        return this.$store.state.clients
      },
      slug() {
        return this.$route.params.slug
      }
    },
    methods: {
      subscribeToClients() {
        this.clientsRef = DATABASE.ref("/clients")
        this.clientsOnChildAdded = this.clientsRef.on("child_added", snapshot => {
          const ClientData = snapshot.val()
          ClientData.key = snapshot.key
          this.$store.commit("pushClient", ClientData)
        })
        this.clientsOnChildChanged = this.clientsRef.on("child_changed", snapshot => {
          const ClientData = snapshot.val()
          ClientData.key = snapshot.key
          this.$store.commit("updateClient", ClientData)
        })
        this.clientsOnChildRemoved = this.clientsRef.on("child_removed", snapshot => {
          this.$store.commit("spliceClient", snapshot.key)
        })
      },
      unsubscribeToClients() {
        this.clientsRef.off("child_added", this.clientsOnChildAdded)
        this.clientsRef.off("child_changed", this.clientsOnChildChanged)
        this.clientsRef.off("child_removed", this.clientsOnChildRemoved)
      },
      subscribeToClients__notAdmin() {
        const { uid } = this.$store.state.user
        this.clientsRef = this.rootRef.child(`/projects-by-user/${ uid }`)
        this.clientsOnChildAdded = this.clientsRef.on("child_added", async snapshot => {
          const { key } = snapshot
          let Client
          try {
            Client = await this.getClientByKey(key)
          } catch (ex) {
            return console.log("Error obteniendo: ", key)
          }
          Client.key = key
          this.$store.commit("pushClient", Client)
        })
        this.clientsOnChildRemoved = this.clientsRef.on("child_removed", snapshot => {
          this.$store.commit("spliceClient", snapshot.key)
        })
      },
      unsubscribeToClients__notAdmin() {
        this.clientsRef.off("child_added", this.clientsOnChildAdded)
        this.clientsRef.off("child_removed", this.clientsOnChildRemoved)
      }
    },
    created() {
      switch (this.role) {
        case "_SUPER" : return this.subscribeToClients()
        case "_PM"    :
        case "_DEV"   :
        case "_CLIENT":
          return this.subscribeToClients__notAdmin()
      }
    },
    mounted() {
      (function($) {
        $(function() {
          var body        = $("body")
          var sidebar     = $(".sidebar")
          var navbar      = $(".navbar").not(".top-navbar")
          // Enable feather-icons with SVG markup
          feather.replace()
          // Bootstrap tooltip
          $('[data-toggle="tooltip"]').tooltip()
          // Clipboard plugin
          // Applying perfect-scrollbar 
          if ($(".sidebar .sidebar-body").length) {
            const sidebarBodyScroll = new PerfectScrollbar(".sidebar-body")
          }
          if ($(".content-nav-wrapper").length) {
            const contentNavWrapper = new PerfectScrollbar(".content-nav-wrapper")
          }
          // Sidebar toggle to sidebar-folded
          $(".sidebar-toggler").on("click", function(e) {
            $(this).toggleClass("active")
            // $(this).toggleClass("not-active")
            if (window.matchMedia("(min-width: 992px)").matches) {
              e.preventDefault()
              body.toggleClass("sidebar-folded")
            } else if (window.matchMedia("(max-width: 991px)").matches) {
              e.preventDefault()
              body.toggleClass("sidebar-open")
            }
          })
          // sidebar-folded on large devices
          function iconSidebar(e) {
            if (e.matches) {
              body.addClass("sidebar-folded")
            } else {
              body.removeClass("sidebar-folded")
            }
          }
          var desktopMedium = window.matchMedia("(min-width:992px) and (max-width: 1199px)")
          desktopMedium.addListener(iconSidebar)
          iconSidebar(desktopMedium)
          // Add active class to nav-link based on url dynamically
          function addActiveClass(element) {
              if (current === "") {
                // for root url
                if (element.attr("href").indexOf("index.html") !== -1) {
                  element.parents(".nav-item").last().addClass("active")
                  if (element.parents(".sub-menu").length) {
                    element.closest(".collapse").addClass("show")
                    element.addClass("active")
                  }
                }
              } else {
                // for other url
                if (element.attr("href").indexOf(current) !== -1) {
                  element.parents(".nav-item").last().addClass("active")
                  if (element.parents(".sub-menu").length) {
                    element.closest(".collapse").addClass("show")
                    element.addClass("active")
                  }
                  if (element.parents(".submenu-item").length) {
                    element.addClass("active")
                  }
                }
              }
          }
          var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, "")
          $(".nav li a", sidebar).each(function() {
            var $this = $(this)
            addActiveClass($this)
          })
          $(".horizontal-menu .nav li a").each(function() {
            var $this = $(this)
            addActiveClass($this)
          })
          // open sidebar-folded when hover
          $(".sidebar .sidebar-body").hover(
          function () {
            if (body.hasClass("sidebar-folded")){
              body.addClass("open-sidebar-folded")
            }
          },
          function () {
            if (body.hasClass("sidebar-folded")){
              body.removeClass("open-sidebar-folded")
            }
          })
          // close sidebar when click outside on mobile/table    
          $(document).on("click touchstart", function(e) {
            e.stopPropagation()
            // closing of sidebar menu when clicking outside of it
            if (!$(e.target).closest(".sidebar-toggler").length) {
              var sidebar = $(e.target).closest(".sidebar").length
              var sidebarBody = $(e.target).closest(".sidebar-body").length
              if (!sidebar && !sidebarBody) {
              if ($("body").hasClass("sidebar-open")) {
                $("body").removeClass("sidebar-open")
              }
              }
            }
          })
          // Popover
          $('[data-toggle="popover"]').popover()
          // Checkboxes and radios
          $(".form-check label,.form-radio label").append('<i class="input-frame"></i>')
        })
      })(jQuery)
    },
    beforeDestroy() {
      this.$set(this.$store.state, "clients", [])
      switch (this.role) {
        case "_SUPER" : return this.unsubscribeToClients()
        case "_PM"    :
        case "_DEV"   :
        case "_CLIENT":
          return this.unsubscribeToClients__notAdmin()
      }
    }
  }
</script>