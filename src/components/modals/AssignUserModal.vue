<template>
  <div class="modal fade"
    id="AssignUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="AssignUserModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AssignUserModal">Nueva asignación de usuario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label for="name">Proyecto</label>
                  <input class="form-control"
                    id="name"
                    name="name"
                    placeholder="Company name"
                    readonly
                    type="text"
                    :value="projectName">
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label for="role">Rol</label>
                  <select @change="getUsersByRole"
                    class="form-control"
                    id="role"
                    name="role"
                    v-model="selectedRole">
                    <option disabled selected :value="null">Seleccione rol</option>
                    <option v-for="(label, key) in roles"
                      :key="key"
                      :label="label"
                      :value="key"
                    ></option>
                  </select>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label for="user">Usuario</label>
                  <select
                    class="form-control"
                    id="user"
                    name="user"
                    v-model="selectedUser">
                    <option disabled selected :value="null">Seleccione usuario</option>
                    <option v-for="user in users"
                      :key="user.uid"
                      :label="user.name"
                      :value="user.value"
                    ></option>
                  </select>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-end">
                <button @click.prevent="save"
                  class="btn btn-primary">
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  export default {
    props: {
      assignedUsers: Array
    },
    data() {
      return {
        rootRef     : DATABASE.ref(),
        selectedRole: null,
        selectedUser: null,
        users       : []
      }
    },
    computed: {
      projectName() {
        const project = this.$store.state.clients.find(x => x.slug == this.$route.params.slug)
        return project.name
      },
      roles() {
        return this.$store.state.roles
      },
      slug() {
        return this.$route.params.slug
      }
    },
    methods: {
      async getUsersByRole() {
        this.users = []
        try {
          const Users = (
            await this.rootRef.child(`profiles`)
              .orderByChild("role")
              .equalTo(this.selectedRole)
              .once("value")
          ).val()
          for (const uid in Users) {
            const index = this.assignedUsers.findIndex(x => x.uid ==  uid)
            if (index == -1) {
              this.users.push({
                name : Users[uid].name,
                value: uid
              })
            }
          }
        } catch (ex) {
          console.error(ex)
        }
      },
      async save() {
        if (this.selectedUser && this.selectedUser.trim() != "") {
          try {
            await this.rootRef.child(`user-links-projects/${ this.slug }/${ this.selectedUser }`)
              .set(true)
            $("#AssignUserModal").modal("hide")
            this.selectedRole = null
            this.selectedUser = null
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al asignar usuario al proyecto.",
              title: "Error",
              type : "error"
            })
          }
        } else {
          return this.$swal({
            text : "Asegúrese de rellenar todos los campos.",
            title: "Campos incompletos",
            type : "error"
          })
        }
        this.$swal({
          text : "Usuario asignado al proyecto con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    }
  }
</script>