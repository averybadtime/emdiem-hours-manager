<template>
  <div class="page-content">
    <NewUserModal @newUserRegistered="newUserRegistered"
      @newUserModal_toggle="newUserModal_toggle"/>
    <EditUserModal :user="selectedUser"
      @userUpdated="userUpdated"
      @editUserModal_toggle="editUserModal_toggle"/>
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
      <div>
        <h4>Usuarios</h4>
      </div>
      <button @click="newUserModal_toggle('show')"
        class="btn btn-primary btn-icon-text mb-2 mb-md-0"
        data-toggle="modal"
        data-target="#NewUserModal">
        <i class="link-icon btn-icon-prepend" data-feather="user-plus"></i>
        Nuevo usuario
      </button>
    </div>
    <div class="row">
      <div class="col-12 grid-margin-stretch-card">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Usuarios</h6>
            <p class="card-description">Listado general de usuarios en el sistema</p>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>E-mail</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha de creación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr @click="editUserModal_toggle('show', user)"
                    v-for="(user, index) in users"
                    data-target="#EditUserModal"
                    data-toggle="modal"
                    :key="user.uid">
                    <td v-text="index + 1"></td>
                    <td v-text="user.name"></td>
                    <td v-text="user.email"></td>
                    <td>{{ user.role | role }}</td>
                    <td>{{ user.status | status }}</td>
                    <td>{{ user.createdAt | date("DD/MM/YYYY") }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import NewUserModal from "@/components/modals/NewUserModal"
  import EditUserModal from "@/components/modals/EditUserModal"
  export default {
    components: {
      NewUserModal,
      EditUserModal
    },
    data() {
      return {
        rootRef     : DATABASE.ref(),
        selectedUser: null,
        users       : null
      }
    },
    methods: {
      editUserModal_toggle(state, user = null) {
        this.selectedUser = user
        $("#EditUserModal").modal(state)
      },
      async getUsers() {
        try {
          const users = (
            await this.rootRef.child("profiles").once("value")
          ).val()

          const _users = []
          for (const uid in users) {
            _users.push({
              ...{ uid },
              ...users[uid]
            })
          }
          this.users = _users

        } catch (ex) {
          throw ex
        }
      },
      newUserModal_toggle(state) {
        $("#NewUserModal").modal(state)
      },
      newUserRegistered(user) {
        this.users.push(user)
      },
      userUpdated(user) {
        const index = this.users.findIndex(x => x.uid == this.selectedUser.uid)
        if (index > -1) {
          this.$set(this.users, index, { ...this.users[index], ...user })
        }
      }
    },
    async created() {
      try {
        await this.getUsers()
      } catch (ex) {
        this.$swal({
          text: "Ocurrió un error al obtener la lista de usuarios. Intente nuevamente.",
          type: "error"
        })
      }
    },
    mounted() {
      feather.replace()
    }
  }
</script>