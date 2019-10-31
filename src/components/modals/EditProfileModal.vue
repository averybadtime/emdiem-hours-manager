<template>
  <div class="modal fade"
    id="EditProfileModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="EditProfileModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditProfileModalLabel">Editar información de perfil</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editUser">
            <div class="form-group">
              <label for="name">Nombre completo</label>
              <input class="form-control" id="name" name="name" placeholder="John Doe" type="text" v-model="editUser.name">
            </div>
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input class="form-control" id="email" name="email" placeholder="jhon@doe.com" type="email" v-model="editUser.email">
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input class="form-control" id="password" name="password" placeholder="not a password" type="password" v-model="editUser.password">
            </div>
            <div class="form-group">
              <label for="email">Rol</label>
              <input class="form-control" id="role" name="role" placeholder="_ROLE" readonly type="text" :value="authUserRole">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button @click.prevent="updateProfile" type="button" class="btn btn-primary">Actualizar información</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE, AUTH } from "@/firebase"
  export default {
    data: () => ({
      editUser: {}
    }),
    computed: {
      authUserRole() {
        switch (this.$store.state.user.role) {
          case "_SUPER": return "Link!"
          case "_PM": return "Project Manager"
          case "_DEV": "Dev"
          case "_CLIENT": "Cliente"
          default: return "Desconocido"
        }
      }
    },
    methods: {
      async updateProfile() {
        const { name, email, password, uid } = this.editUser
        if (
          name && name.trim() != "" &&
          email && email.trim() != ""
        ) {
          try {
            await AUTH.currentUser.updateProfile({ displayName: name })
            await DATABASE.ref(`/profiles/${ uid }`).update({ name, email })
            if (email != this.$store.state.user.email) {
              await AUTH.currentUser.updateEmail(email)
            }
            if (password && password.trim() != "") {
              await AUTH.currentUser.updatePassword(password)
            }
          } catch (ex) {
            console.log(ex)
            return this.$swal({
              text : "Ocurrió un error al actualizar la información del perfil de usuario.",
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
        this.$store.commit("setUser", { name, email })
        this.$swal({
          text : "Información de perfil de usuario actualizada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
        this.$emit("editProfileModal_toggle", false)
      }
    },
    created() {
      this.editUser = Object.assign({}, this.$store.state.user)
    }
  }
</script>