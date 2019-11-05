<template>
  <div class="modal fade"
    id="NewUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="NewUserModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="NewUserModal">Nuevo registro de usuario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="name">Nombre completo</label>
              <input class="form-control"
                id="name"
                name="name"
                placeholder="John Doe"
                type="text"
                v-model="newUser.name">
            </div>
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input class="form-control"
                id="email"
                name="email"
                placeholder="jhon@doe.com"
                type="email"
                v-model="newUser.email">
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input class="form-control"
                id="password"
                name="password"
                placeholder="Esto no es una contraseña :p"
                type="password"
                v-model="newUser.password">
            </div>
            <div class="form-group">
              <label for="role">Rol</label>
              <select class="form-control"
                name="role"
                id="role"
                v-model="newUser.role">
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
          <button @click.prevent="save" type="button" class="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  export default {
    data() {
      return {
        newUser: {
          role: ""
        }
      }
    },
    computed: {
      roles() {
        return this.$store.state.roles
      }
    },
    methods: {
      async save() {
        const { name, email, password, role } = this.newUser
        if (
          name && name.trim() != "" &&
          email && email.trim() != "" &&
          password && password.trim() != "" &&
          role && role.trim() != ""
        ) {
          try {
            const { data } = await axios.post(`${ this.$store.state.baseURL }/api/users`, { name, email, password, role })
            const { uid, createdAt } = data
            this.$emit("newUserRegistered", {
              createdAt,
              email,
              name,
              role,
              uid
            })
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
          text : "Nuevo usuario registrado con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
        this.newUser = { role: "" }
        this.$emit("newUserModal_toggle", "hide")
      }
    }
  }
</script>