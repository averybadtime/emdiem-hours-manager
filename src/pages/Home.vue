<template>
  <div class="page-content">
    <NewClientModal/>
    <div class="d-flex justify-content-between align-items-center">
      <h4 class="mb-3 mb-md-0">Dashboard</h4>
      <div class="d-flex align-items-center flex-wrap text-nowrap">
        <button type="button" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0 mr-2">
          <i class="btn-icon-prepend" data-feather="plus-circle"></i>
          Compra de horas
        </button>
        <button type="button"
          class="btn btn-primary btn-icon-text mb-2 mb-md-0"
          @click="showNewClientModal">
          <i data-feather="user-plus" class="btn-icon-prepend"></i>
          Nuevo cliente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import NewClientModal from "@/components/modals/NewClientModal"
  export default {
    components: {
      NewClientModal
    },
    methods: {
      showNewClientModal() {
        $("#NewClientModal").modal("show")
      }
    },
    mounted() {
      feather.replace()
    }
  }
</script>