<template>
  <div class="modal fade"
    id="EditClientModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="EditClientModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditClientModal">Actualizar información de cliente</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editClient">
            <div class="form-group">
              <label for="id">Nombre</label>
              <input class="form-control"
                id="name"
                name="name"
                placeholder="Nombre"
                type="text"
                v-model="editClient.name">
            </div>
            <div class="form-group">
              <label for="id">NIT/CC</label>
              <input class="form-control"
                id="id"
                name="id"
                placeholder="NIT/CC"
                type="text"
                v-model="editClient.id">
            </div>
            <div class="form-group">
              <label for="name">Bio - Descripción</label>
              <textarea name="bio"
                id="bio"
                cols="30"
                rows="6"
                class="form-control"
                placeholder="Descripción"
                v-model="editClient.bio">
              </textarea>
            </div>
            <div class="form-group">
              <label for="address">Dirección</label>
              <input class="form-control"
                id="address"
                name="address"
                placeholder="Dirección"
                type="text"
                v-model="editClient.address">
            </div>
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input class="form-control"
                id="phone"
                name="phone"
                placeholder="+1 324-876-5768"
                type="tel"
                v-model="editClient.phone">
            </div>
            <div class="form-group">
              <label for="location">Ubicación</label>
              <input class="form-control"
                id="location"
                name="location"
                placeholder="Ubicación"
                type="text"
                v-model="editClient.location">
            </div>
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input class="form-control"
                id="email"
                name="email"
                placeholder="company@domain.com"
                type="email"
                v-model="editClient.email">
            </div>
            <div class="form-group">
              <label for="location">Website</label>
              <input class="form-control"
                id="website"
                name="website"
                placeholder="www.domain.com"
                type="text"
                v-model="editClient.website">
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
  import { DATABASE } from "@/firebase"
  export default {
    props: {
      client: Object,
      slug  : String
    },
    data() {
      return {
        editClient: null
      }
    },
    watch: {
      client(next) {
        this.editClient = Object.assign({}, next)
      }
    },
    methods: {
      async update() {
        const { address, bio, id, location, name, email, phone, website } = this.editClient
        if (
          address && address.trim() != "" &&
          email && email.trim() != "" &&
          id && id.toString().trim() != "" &&
          name && name.trim() != "" &&
          phone && phone.trim() != ""
        ) {
          try {
            const updates = {
              address,
              bio: bio && bio.trim() != "" ? bio : null,
              email,
              id,
              location: location && location.trim() != "" ? location : null,
              name,
              phone,
              website : website && website.trim() != "" ? website : null
            }
            await DATABASE.ref(`/clients/${ this.slug }`)
              .update(updates)
            $("#EditClientModal").modal("hide")
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al actualizar la información del cliente.",
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
          text : "Información de cliente actualizada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    },
    created() {
      this.editClient = Object.assign({}, this.client)
    }
  }
</script>