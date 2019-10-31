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
        <transition name="fade">
          <router-view/>
        </transition>
        <EFooter/>
      </div>
    </div>
  </div>
</template>

<script>
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
    data: () => ({
      editProfileModal__visible: false
    }),
    watch: {
      "$route"(next, prev) {
        if (prev.name == "LOGIN") {
          feather.replace()
        }
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
      // require("@/assets/js/template.js")
      require("@/assets/js/dashboard.js")
      require("@/assets/js/datepicker.js")
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Overpass:300,300i,400,600,600i,800,800i,900,900i&display=swap");
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }
</style>