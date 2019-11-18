<template>
  <div class="page-content">
    <EditClientModal :slug="slug" :client="client"/>
    <div class="profile-page tx-13">
      <div class="row">
        <div class="col-12 grid-margin">
          <div class="profile-header">
            <div class="cover">
              <div class="gray-shade"></div>
              <figure>
                <img src="https://www.nobleui.com/html/template/assets/images/profile-cover.jpg" alt="Cover image">
              </figure>
              <div class="cover-body d-flex justify-content-between align-items-center">
                <div>
                  <img src="https://www.nobleui.com/html/template/assets/images/faces/face1.jpg" alt="Profile image" class="profile-pic">
                  <span class="profile-name">{{ client ? client.name : "Cargando..." }}</span>
                </div>
                <div class="d-none d-md-block">
                  <button class="btn btn-primary btn-icon-text btn-edit-profile"
                    data-toggle="modal"
                    data-target="#EditClientModal">
                    <i class="btn-icon-prepend" data-feather="edit"></i>
                    Editar información
                  </button>
                </div>
              </div>
            </div>
            <div class="header-links">
              <ul class="links d-flex align-items-center mt-3 mt-md-0">
                <li v-for="(item, index) in headerItems"
                  :key="index"
                  class="header-link-item ml-3 pl-3 d-flex align-items-center"
                  :class="{ active: item.route == routeName }">
                  <i class="mr-1 icon-md" :data-feather="item.icon"></i>
                  <router-link :to="{ name: item.route }">{{ item.label }}</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row profile-body">
        <div class="d-none d-md-block col-md-4 col-xl-3 left-wrapper">
          <AboutCard :about="about"/>
        </div>
        <div class="col-md-8 col-xl-9 right-wrapper">
          <div class="card">
            <div class="card-body">
              <transition name="fade" mode="out-in">
                <router-view/>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import AboutCard from "@/components/AboutCard"
  import EditClientModal from "@/components/modals/EditClientModal"
  export default {
    components: {
      AboutCard,
      EditClientModal
    },
    data() {
      return {
        headerItems: [
          {
            icon: "columns",
            label: "Dashboard",
            route: "CLIENT_DASHBOARD"
          },
          {
            icon: "clipboard",
            label: "Historias",
            route: "CLIENT_STORIES"
          },
          {
            icon: "check-square",
            label: "Tareas",
            route: "CLIENT_TASKS"
          },
          {
            icon: "activity",
            label: "Actividad",
            route: "CLIENT_ACTIVITY"
          },
          {
            icon: "sliders",
            label: "Avanzado",
            route: "CLIENT_ADVANCED"
          }
        ],
        rootRef: DATABASE.ref()
      }
    },
    computed: {
      about() {
        if (this.client) {
          const { address, bio, createdAt, id, location, email, phone, website } = this.client
          return {
            address,
            bio,
            createdAt,
            id,
            location: location || "No especificada",
            email,
            phone,
            website: website || "No especificada"
          }
        }
        return {}
      },
      client() {
        return this.$store.state.clients.find(x => x.key == this.slug) || {}
      },
      routeName() {
        return this.$route.name
      },
      slug() {
        return this.$route.params.slug
      }
    },
    mounted() {
      feather.replace()
    }
  }
</script>