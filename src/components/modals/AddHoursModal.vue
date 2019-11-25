<template>
  <div class="modal fade"
    id="AddHoursModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="AddHoursModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AddHoursModal">Nueva asignación de horas</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="client">Cliente</label>
              <select id="client"
                name="client"
                v-model="newTransaction.client">
                <option disabled selected value="">Seleccione cliente</option>
                <option v-for="client in clients"
                  :key="client.key"
                  :label="client.name"
                  :value="client.key">
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="detail">Detalle</label>
              <input class="form-control"
                id="detail"
                name="detail"
                placeholder="Detalle de compra de horas"
                type="text"
                v-model="newTransaction.detail">
            </div>
            <div class="form-group">
              <label for="hours">Cantidad de horas</label>
              <input class="form-control"
                id="hours"
                name="hours"
                placeholder="Cantidad de horas"
                type="number"
                v-model.number="newTransaction.hours">
            </div>
            <div class="form-group">
              <label for="amount">Monto $</label>
              <input class="form-control"
                id="amount"
                name="amount"
                placeholder="Monto/Costo"
                type="number"
                v-model.number="newTransaction.amount">
            </div>
            <div class="form-group">
              <label for="notes">Observaciones</label>
              <textarea name="notes"
                class="form-control"
                cols="30"
                id="notes"
                placeholder="Comentarios y observaciones opcionales"
                rows="6"
                v-model="newTransaction.notes">
              </textarea>
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
        newTransaction: {
          client: ""
        },
        rootRef: DATABASE.ref()
      }
    },
    computed: {
      clients() {
        return this.$store.state.clients
      }
    },
    methods: {
      async save() {
        const { amount, client, detail, hours, notes } = this.newTransaction
        if (
          amount && amount.toString().trim() != "" &&
          client && client.trim() != "" &&
          detail && detail.trim() != "" &&
          hours && hours.toString().trim() != ""
        ) {
          if (hours > 0) {
            try {
              // Client object
              const { name, availableHours } = this.clients.find(x => x.key == client)
              const action = await this.$swal({
                cancelButtonText : "Cancelar",
                confirmButtonText: "Agregar horas",
                text             : `¿Desea agregar ${ hours } horas al cliente "${ name }"?`,
                title            : "Confirmación",
                type             : "warning",
                showCancelButton : true
              })
              if (action.value) {
                const createdAt = moment().unix()
                const NewTransactionKey = await this.rootRef.child(`/transactions/${ client }`).push().key
                const NewAvailableHours = availableHours ? availableHours + hours : hours
                const updates = {}
                updates[`/clients/${ client }/availableHours`] = NewAvailableHours
                updates[`/transactions/${ client }/${ NewTransactionKey }`] = {
                  client,
                  createdAt,
                  detail,
                  hours,
                  notes: notes && notes.trim() != "" ? notes : null
                }
                await this.rootRef.update(updates)
                $("#AddHoursModal").modal("hide")
              } else {
                return
              }
            } catch (ex) {
              return this.$swal({
                text : "Ocurrió un error al realizar la operación.",
                title: "Error",
                type : "error"
              })
            }
          } else {
            return this.$swal({
              text : "El número de horas agregadas debe ser mayor a 0.",
              title: "Cantidad de horas inválida",
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
          text : "Nuevo registro creado con éxito.",
          title: "¡Hecho!",
          type : "success"
        })
        this.newTransaction = { client: "" }
      }
    }
  }
</script>