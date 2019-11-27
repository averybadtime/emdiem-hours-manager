<template>
  <div class="d-flex align-items-center border-bottom py-3">
    <div class="mr-3">
      <div class="LetterCircle rounded-circle wd-35">
        <i class="icon-md" data-feather="dollar-sign"></i>
      </div>
    </div>
    <div class="w-100">
      <div class="d-flex justify-content-between">
        <h6 class="text-body mb-1">{{ transaction.detail }}</h6>
        <div v-if="$isAdmin()" class="dropdown">
          <button class="btn p-0" type="button" :id="transaction.key" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="icon-lg text-muted pb-3px" data-feather="more-horizontal"></i>
          </button>
          <div class="dropdown-menu" :aria-labelledby="transaction.key">
            <a class="dropdown-item" @click.prevent="edit">
              <i class="icon-md mr-1" data-feather="edit"></i>
              Editar
            </a>
            <a class="dropdown-item" @click.prevent="destroy">
              <i class="icon-md mr-1" data-feather="trash-2"></i>
              Eliminar
            </a>
          </div>
        </div>
      </div>
      <p class="text-muted tx-14">{{ transaction.notes || "Sin observaciones." }}</p>
      <h5>
        <span class="badge badge-success badge-large">{{ transaction.amount | currency }}</span>
      </h5>
      <p class="text-muted tx-12">{{ transaction.createdAt | date }}</p>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  export default {
    props: {
      transaction: Object
    },
    methods: {
      async destroy() {
        try {
          const action = await this.$swal({
            cancelButtonText : "Cancelar",
            confirmButtonText: "Eliminar",
            text             : "¿Desea eliminar el registro seleccionado?",
            title            : "Confirmación",
            type             : "warning",
            showCancelButton : true
          })
          if (action.value) {
            await DATABASE.ref(`/transactions/${ this.$route.params.slug }/${ this.transaction.key }`)
              .set(null)
            this.$swal({
              text : "Información de cliente actualizada con éxito.",
              title: "¡Hecho!",
              type : "success"
            })
          }
        } catch (ex) {
          this.$swal({
            text : "Ocurrió un error al eliminar la información del registro.",
            title: "Error",
            type : "error"
          })
        }
      },
      edit() {
        this.$emit("show", this.transaction.key)
      }
    },
    mounted() {
      feather.replace()
    }
  }
</script>