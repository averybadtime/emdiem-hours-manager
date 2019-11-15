<template>
  <div class="modal fade"
    id="NewClientModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="NewClientModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="NewClientModal">Nuevo registro de cliente</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="id">Nombre</label>
              <input class="form-control"
                id="name"
                name="name"
                placeholder="Nombre"
                type="text"
                v-model="newClient.name">
            </div>
            <div class="form-group">
              <label for="id">NIT/CC</label>
              <input class="form-control"
                id="id"
                name="id"
                placeholder="NIT/CC"
                type="text"
                v-model="newClient.id">
            </div>
            <div class="form-group">
              <label for="name">Bio - Descripción</label>
              <textarea name="bio"
                id="bio"
                cols="30"
                rows="6"
                class="form-control"
                placeholder="Descripción"
                v-model="newClient.bio">
              </textarea>
            </div>
            <div class="form-group">
              <label for="address">Dirección</label>
              <input class="form-control"
                id="address"
                name="address"
                placeholder="Dirección"
                type="text"
                v-model="newClient.address">
            </div>
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input class="form-control"
                id="phone"
                name="phone"
                placeholder="+1 324-876-5768"
                type="tel"
                v-model="newClient.phone">
            </div>
            <div class="form-group">
              <label for="location">Ubicación</label>
              <input class="form-control"
                id="location"
                name="location"
                placeholder="Ubicación"
                type="text"
                v-model="newClient.location">
            </div>
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input class="form-control"
                id="email"
                name="email"
                placeholder="company@domain.com"
                type="email"
                v-model="newClient.email">
            </div>
            <div class="form-group">
              <label for="location">Website</label>
              <input class="form-control"
                id="website"
                name="website"
                placeholder="www.domain.com"
                type="text"
                v-model="newClient.website">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button @click.prevent="save" type="button" class="btn btn-primary">Actualizar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import moment from "moment"
  export default {
    data() {
      return {
        newClient: {},
        rootRef: DATABASE.ref()
      }
    },
    methods: {
      async generateSlug(name) {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
        const p = new RegExp(a.split('').join('|'), 'g')
        let slug = name.toString().toLowerCase()
          .replace(/\s+/g, "-")
          .replace(p, c => b.charAt(a.indexOf(c)))
          .replace(/&/g, "-and-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "")
        let exists = false
        let attemp = 1
        do {
          try {
            exists = (
              await this.rootRef.child(`/clients`)
                .orderByChild("slug")
                .equalTo(slug)
                .once("value")
            ).exists()
            if (exists) {
              slug = `${ slug }-${ attemp }`
              attemp++
            }
          } catch (ex) {
            throw ex
          }
        } while (exists)
        return slug
      },
      async save() {
        const { name, id, bio, address, phone, location, email, website } = this.newClient
        if (
          address && address.trim() != "" &&
          email && email.trim() != "" &&
          id && id.toString().trim() != "" &&
          name && name.trim() != "" &&
          phone && phone.trim() != ""
        ) {
          try {
            const slug = await this.generateSlug(name)
            const updates = {
              address,
              bio: bio && bio.trim() != "" ? bio : null,
              createdAt: moment().unix(),
              email,
              id,
              location: location && location.trim() != "" ? location : null,
              name,
              phone,
              slug,
              website : website && website.trim() != "" ? website : null
            }
            await this.rootRef.child(`/clients/${ slug }`)
              .update(updates)
            $("#NewClientModal").modal("hide")
            this.newClient = {}
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al registrar nuevo cliente.",
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
          text : "Nuevo cliente registrado con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    }
  }
</script>