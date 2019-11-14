<template>
  <div class="modal fade"
    id="EditTransactionModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="EditTransactionModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditTransactionModal">Editar información de registro</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form v-if="editTransaction">
            <div class="form-group">
              <label for="e-detail">Detalle</label>
              <input class="form-control"
                id="e-detail"
                name="e-detail"
                placeholder="Detalle de transacción"
                type="text"
                v-model="editTransaction.detail">
            </div>
            <div class="form-group">
              <label for="e-hours">Horas adquiridas</label>
              <input class="form-control"
                id="e-hours"
                name="e-hours"
                placeholder="Cantidad de horas adquiridas"
                type="number"
                v-model.number="editTransaction.hours">
            </div>
            <div class="form-group">
              <label for="e-hours">Observaciones (opcional)</label>
              <textarea id="e-notes"
                class="form-control"
                cols="30"
                name="e-notes"
                placeholder="Observaciones/Notas"
                rows="6"
                v-model="editTransaction.notes">
              </textarea>
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
      transaction: Object
    },
    data() {
      return {
        editTransaction: null
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug
      }
    },
    watch: {
      transaction(next) {
        this.editTransaction = Object.assign({}, next)
      }
    },
    methods: {
      async update() {
        const { detail, hours, notes } = this.editTransaction
        if (
          detail && detail.trim() != "" &&
          hours && hours.toString().trim() != ""
        ) {
          try {
            await DATABASE.ref(`/transactions/${ this.slug }/${ this.transaction.key }`)
              .update({
                detail,
                hours,
                notes: notes && notes.trim() != "" ? notes : null
              })
            $("#EditTransactionModal").modal("hide")
          } catch (ex) {
            return this.$swal({
              text : "Ocurrió un error al actualizar la información del registro.",
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
          text : "Información de registro actualizada con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
      }
    }
  }
</script>