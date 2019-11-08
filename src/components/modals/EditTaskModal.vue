<template>
  <div class="modal fade"
    id="EditTaskModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="EditTaskModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 v-if="task" class="modal-title" id="EditTaskModal">Editar información de tarea - {{ task.title }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editTask">
            <div class="form-group">
              <label for="title">Título</label>
              <input class="form-control"
                id="title"
                name="title"
                placeholder="Título"
                type="text"
                v-model="editTask.title">
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea class="form-control"
                id="description"
                name="description"
                placeholder="Descripción"
                cols="30"
                rows="6"
                v-model="editTask.description">
              </textarea>
            </div>
            <div class="form-group">
              <label for="dev">Desarrollador</label>
              <input class="form-control"
                id="dev"
                name="dev"
                placeholder="Desarrollador"
                readonly
                type="text"
                :value="editTask.createdBy">
            </div>
            <div class="form-group">
              <label for="hours">Horas empleadas</label>
              <input class="form-control"
                id="hours"
                name="hours"
                placeholder="Horas empleadas"
                type="number"
                v-model.number="editTask.hours">
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
      task: Object
    },
    data() {
      return {
        editTask: null
      }
    },
    watch: {
      task(next) {
        this.editTask = Object.assign({}, next)
      }
    },
    methods: {
      async update() {
        const { key, title, description, hours } = this.editTask
        if (
          title && title.trim() != "" &&
          description && description.trim() != "" &&
          hours && hours.toString().trim() != ""
        ) {
          const updates = { title, description, hours }
          try {
            await DATABASE.ref(`/tasks/${ this.task.key }`)
              .update(updates)
            this.$emit("taskInfoUpdated", {
              ...{ key },
              ...updates
            })
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al actualizar la información de la tarea.",
              title: "Error",
              type : "error"
            })
          }
          $("#EditTaskModal").modal("hide")
        } else {
          return this.$swal({
            text : "Asegúrese de rellenar todos los campos.",
            title: "Campos incompletos",
            type : "error"
          })
        }
        this.$swal({
          text : "Información de tarea actualizada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    }
  }
</script>