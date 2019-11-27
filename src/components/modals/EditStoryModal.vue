<template>
  <div class="modal fade"
    id="EditStoryModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="EditStoryModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 v-if="story" class="modal-title" id="EditStoryModal">
            <span v-if="$isAdmin() || $isPM()">Editar información de historia - </span>{{ story.title }}
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editStory">
            <div class="form-group">
              <label for="title">Título</label>
              <input class="form-control"
                id="title"
                name="title"
                placeholder="Título"
                :readonly="!$isAdmin() && !$isPM()"
                type="text"
                v-model="editStory.title">
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea class="form-control"
                id="description"
                name="description"
                placeholder="Descripción"
                :readonly="!$isAdmin() && !$isPM()"
                cols="30"
                rows="6"
                v-model="editStory.description">
              </textarea>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="status">Estado</label>
                <select class="form-control"
                  name="status"
                  id="status"
                  :disabled="!$isAdmin() && !$isPM()"
                  v-model="editStory.status">
                  <option value="" disabled selected>Seleccionar estado</option>
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
                  :disabled="!$isAdmin() && !$isPM()"
                  v-model.number="editStory.level">
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
        <div class="modal-footer" v-if="$isAdmin() || $isPM()">
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
      story: Object
    },
    data() {
      return {
        editStory: null,
        difficultLevels: [1, 2, 3, 5, 8, 13]
      }
    },
    computed: {
      states() {
        return this.$store.state.storyStates
      }
    },
    watch: {
      story(next) {
        this.editStory = Object.assign({}, next)
      }
    },
    methods: {
      async update() {
        const { key, title, description, status, level } = this.editStory
        if (
          title && title.trim() != "" &&
          description && description.trim() != "" &&
          status && status.trim() != "" &&
          level && level.toString().trim() != ""
        ) {
          const updates = { title, description, status, level }
          try {
            await DATABASE.ref(`/stories/${ this.story.key }/data`)
              .update(updates)
            this.$emit("storyInfoUpdated", {
              ...{ key },
              ...updates
            })
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al actualizar la información de la historia.",
              title: "Error",
              type : "error"
            })
          }
          $("#EditStoryModal").modal("hide")
        } else {
          return this.$swal({
            text : "Asegúrese de rellenar todos los campos.",
            title: "Campos incompletos",
            type : "error"
          })
        }
        this.$swal({
          text : "Información de historia actualizada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    }
  }
</script>