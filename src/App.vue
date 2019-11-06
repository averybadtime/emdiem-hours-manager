<template>
  <div id="app">
    <div class="main-wrapper">
      <EditProfileModal @editProfileModal_toggle="editProfileModal_toggle"
        v-if="isAuthenticated && editProfileModal__visible">
      </EditProfileModal>
      <SideBar v-if="isAuthenticated"/>
      <div class="page-wrapper">
        <TopBar @editProfileModal_toggle="editProfileModal_toggle"
          v-if="isAuthenticated">
        </TopBar>
        <transition name="fade"
          mode="out-in">
          <router-view/>
        </transition>
        <EFooter/>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import $ from "jquery"
  import SideBar from "@/components/SideBar"
  import TopBar from "@/components/TopBar"
  import EFooter from "@/components/EFooter"
  import EditProfileModal from "@/components/modals/EditProfileModal"
  export default {
    components: {
      SideBar,
      TopBar,
      EFooter,
      EditProfileModal
    },
    data() {
      return {
        editProfileModal__visible: false
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.state.user
      }
    },
    methods: {
      editProfileModal_toggle(state) {
        this.editProfileModal__visible = state
        $("#EditProfileModal").modal("hide")
      },
      async fetRoles() {
        try {
          const roles = (
            await DATABASE.ref("/settings/roles")
              .once("value")
          ).val()
          this.$store.commit("setRoles", roles)
        } catch (ex) {
          console.error("Ocurrió un error al descargar los roles. Error: ", ex)
        }
      },
      async fetchURL() {
        try {
          const URL = (
            await DATABASE.ref("/settings/baseURL")
              .once("value")
          ).val()
          this.$store.commit("setBaseURL", URL)
        } catch (ex) {
          console.error("Ocurrió un error al descargar la URL base. Error: ", ex)
        }
      }
    },
    beforeCreate() {
      window.$ = window.jQuery = $
      require("@/assets/js/popper.js")
      require("@/assets/js/bootstrap.js")
      require("@/assets/vendors/chartjs/Chart.min.js")
      require("@/assets/vendors/jquery.flot/jquery.flot.js")
      require("@/assets/vendors/jquery.flot/jquery.flot.resize.js")
      require("@/assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js")
      require("@/assets/vendors/apexcharts/apexcharts.min.js")
      require("@/assets/vendors/progressbar.js/progressbar.min.js")
      require("@/assets/vendors/feather-icons/feather.min.js")
      require("@/assets/js/dashboard.js")
      require("@/assets/js/datepicker.js")
    },
    async created() {
      await this.fetchURL()
      await this.fetRoles()
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Overpass:300,300i,400,600,600i,800,800i,900,900i&display=swap");

  tr {
    cursor: pointer;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .LetterCircle {
    align-items: center;
    background-color: #727cf5;
    color: white;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    height: 35px;
    justify-content: center;
    overflow: hidden;
  }
</style>