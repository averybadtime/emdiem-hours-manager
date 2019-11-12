<template>
  <div class="modal fade"
    id="NewTaskModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="NewTaskModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="NewTaskModal">Nuevo registro de usuario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="e-title">Título</label>
              <input class="form-control"
                id="e-title"
                name="e-title"
                placeholder="Título"
                type="text"
                v-model="newTask.title">
            </div>
            <div class="form-group">
              <label for="e-description">Descripción</label>
              <textarea class="form-control"
                id="e-description"
                name="e-description"
                placeholder="Descripción"
                cols="30"
                rows="6"
                v-model="newTask.description">
              </textarea>
            </div>
            <div class="form-group">
              <label for="e-dev">Desarrollador</label>
              <input class="form-control"
                id="e-dev"
                name="e-dev"
                placeholder="Desarrollador"
                readonly
                type="text"
                :value="$store.state.user.name">
            </div>
            <div class="form-group">
              <label for="e-hours">Horas empleadas</label>
              <input class="form-control"
                id="e-hours"
                name="e-hours"
                placeholder="Horas empleadas"
                type="number"
                v-model.number="newTask.hours">
            </div>
            <div v-if="canSelectStory" class="form-group">
              <label for="role">Historia</label>
              <select class="form-control"
                name="story"
                id="story"
                v-model="newTask.story">
                <option value="" disabled selected>Seleccionar historia</option>
                <option v-for="story in storiesList"
                  :key="story.value"
                  :label="story.label"
                  :value="story.value">
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
  import { DATABASE } from "@/firebase"
  import moment from "moment"
  export default {
    props: {
      storiesList: Array
    },
    data() {
      return {
        newTask: {
          story: ""
        },
        rootRef: DATABASE.ref()
      }
    },
    computed: {
      canSelectStory() {
        return this.$route.params.story_key == null
      }
    },
    methods: {
      async save() {
        const { title, description, hours, story } = this.newTask
        const storyKey = this.$route.params.story_key || story
        if (
          title && title.trim() != "" &&
          description && description.trim() != "" &&
          hours && hours.toString().trim() != "" &&
          storyKey && storyKey.trim() != ""
        ) {
          try {
            const key = await this.rootRef.child(`/stories/${ story }/tasks`).push().key
            const { user } = this.$store.state
            const task = {
              createdAt: moment().unix(),
              createdBy: user.uid,
              description,
              hours,
              title
            }
            const updates = {}
            updates[`/stories/${ storyKey }/tasks/${ key }`] = true
            updates[`/tasks/${ key }`] = task
            await this.rootRef.update(updates)
            task.createdByName = user.name
            task.key = key
            this.$emit("newTask", { storyKey, task })
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al registrar nueva tarea.",
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
          text : "Nueva tarea registrada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
        this.newTask = { story: "" }
        $("#NewTaskModal").modal("hide")
      }
    }
  }
</script>