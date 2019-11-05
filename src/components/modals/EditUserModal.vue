<template>
  <div class="modal fade"
    id="EditUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="EditUserModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditUserModal">Editar información de usuario de usuario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editUser">
            <div class="form-group">
              <label for="e-name">Nombre completo</label>
              <input class="form-control"
                id="e-name"
                name="e-name"
                placeholder="John Doe"
                type="text"
                v-model="editUser.name">
            </div>
            <div class="form-group">
              <label for="e-email">Correo electrónico</label>
              <input class="form-control"
                id="e-email"
                name="e-email"
                placeholder="jhon@doe.com"
                type="email"
                v-model="editUser.email">
            </div>
            <div class="form-group">
              <label for="e-password">Contraseña</label>
              <input class="form-control"
                id="e-password"
                name="e-password"
                placeholder="Esto no es una contraseña :p"
                type="password"
                v-model="editUser.password">
            </div>
            <div class="form-group">
              <label for="e-role">Rol</label>
              <select class="form-control"
                name="e-role"
                id="e-role"
                v-model="editUser.role">
                <option value="" disabled selected>Seleccionar rol</option>
                <option v-for="(label, value) in roles"
                  :key="value"
                  :label="label"
                  :value="value">
                </option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button @click.prevent="update" type="button" class="btn btn-primary">Actualizar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  export default {
    props: {
      user: Object
    },
    data() {
      return {
        editUser: null
      }
    },
    computed: {
      roles() {
        return this.$store.state.roles
      }
    },
    watch: {
      user(next) {
        this.editUser = Object.assign({}, next)
      }
    },
    methods: {
      async update() {
        const { uid, name, email, password, role } = this.editUser
        if (
          name && name.trim() != "" &&
          email && email.trim() != "" &&
          role && role.trim() != ""
        ) {
          try {
            const { data } = await axios.put(`${ this.$store.state.baseURL }/api/users`, {
              uid, name, email, password: password.trim() == "" ? null : password, role
            })
            this.$emit("userUpdated", { email, name, role })
          } catch (ex) {
            return this.$swal({
              text : ex.response.data,
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
          text : "Información de usuario actualizada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
        this.$emit("editUserModal_toggle", "hide")
      }
    }
  }
</script>