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
          <h5 class="modal-title" id="EditStoryModal">Editar información de usuario de usuario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editStory">
            <div class="form-group">
              <label for="e-name">Nombre completo</label>
              <input class="form-control"
                id="e-name"
                name="e-name"
                placeholder="John Doe"
                type="text"
                v-model="editStory.title">
            </div>
            <div class="form-group">
              <label for="e-email">Correo electrónico</label>
              <input class="form-control"
                id="e-email"
                name="e-email"
                placeholder="jhon@doe.com"
                type="email"
                v-model="editStory.title">
            </div>
            <div class="form-group">
              <label for="e-password">Contraseña</label>
              <input class="form-control"
                id="e-password"
                name="e-password"
                placeholder="Esto no es una contraseña :p"
                type="password"
                v-model="editStory.title">
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
  export default {
    props: {
      story: Object
    },
    data() {
      return {
        editStory: null
      }
    },
    watch: {
      story(next) {
        this.editStory = Object.assign({}, next)
      }
    }
  }
</script>