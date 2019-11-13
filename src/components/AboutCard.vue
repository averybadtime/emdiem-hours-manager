<template>
  <div class="card rounded">
    <div class="card-body">
      <h6 class="card-title mb-2">Información</h6>
      <p>{{ about.bio }}</p>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">Cliente desde:</label>
        <p class="text-muted">{{ about.createdAt | date }}</p>
      </div>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">NIT/CC:</label>
        <p class="text-muted">{{ about.id }}</p>
      </div>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">Ubicación:</label>
        <p class="text-muted">{{ about.location }}</p>
      </div>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">Teléfono:</label>
        <p class="text-muted">{{ about.phone }}</p>
      </div>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">Dirección:</label>
        <p class="text-muted">{{ about.address }}</p>
      </div>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">E-mail:</label>
        <p class="text-muted">{{ about.email }}</p>
      </div>
      <div class="mt-3">
        <label class="tx-11 font-weight-bold mb-0 text-uppercase">Website:</label>
        <p class="text-muted">{{ about.website }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      about: Object
    }
  }
</script>