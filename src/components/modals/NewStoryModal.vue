<template>
  <div class="modal fade"
    id="NewStoryModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="NewStoryModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="NewStoryModal">Nuevo registro de historia</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="title">Título</label>
              <input class="form-control"
                id="title"
                name="title"
                placeholder="Título"
                type="text"
                v-model="newStory.title">
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea class="form-control"
                id="description"
                name="description"
                placeholder="Descripción"
                cols="30"
                rows="6"
                v-model="newStory.description">
              </textarea>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="status">Estado</label>
                <select class="form-control"
                  disabled
                  name="status"
                  id="status"
                  v-model="newStory.status">
                  <option v-for="(label, value) in states"
                    :key="value"
                    :label="label"
                    :value="value">
                  </option>
                </select>
              </div>
              <div class="col-6">
                <label for="status">Nivel de dificultad</label>
                <select class="form-control"
                  name="level"
                  id="level"
                  v-model.number="newStory.level">
                  <option value="" disabled selected>Seleccionar dificultad</option>
                  <option v-for="level in difficultLevels"
                    :key="level"
                    :label="level"
                    :value="level">
                  </option>
                </select>
              </div>
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
  import { DATABASE } from "@/firebase"
  import moment from "moment"
  export default {
    data() {
      return {
        difficultLevels: [1, 2, 3, 5, 8, 13],
        newStory: {
          level: "",
          status: "_PENDING"
        },
        rootRef: DATABASE.ref()
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug
      },
      states() {
        return this.$store.state.storyStates
      }
    },
    methods: {
      async save() {
        const { title, description, status, level } = this.newStory
        if (
          title && title.trim() != "" &&
          description && description.trim() != "" &&
          status && status.trim() != "" &&
          level && level.toString().trim() != ""
        ) {
          try {
            const NewStoryKey = await this.rootRef.child(`/client-stories/${ this.slug }`).push().key
            Object.assign(this.newStory, {
              createdAt: moment().unix(),
              createdBy: this.$store.state.user.uid
            })
            const updates = {}
            updates[`/client-stories/${ this.slug }/${ NewStoryKey }`] = true
            updates[`/stories/${ NewStoryKey }/data`] = this.newStory
            await this.rootRef.update(updates)
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al registrar nueva historia.",
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
        this.newStory = {
          level: "",
          status: "_PENDING"
        }
        $("#NewStoryModal").modal("hide")
        this.$swal({
          text : "Nueva historia registrada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    }
  }
</script>