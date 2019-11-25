<template>
  <div :class="`card bg-${ type } text-white`">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-baseline mb-3">
        <h6 class="card-title mb-0 text-white">{{ title }}</h6>
      </div>
      <div class="row">
        <div class="col-6 col-md-12">
          <h3 class="mb-2">{{ stat }}</h3>
          <div class="d-flex align-items-baseline">
            <p>{{ description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      description: String,
      stat       : [String, Number],
      title      : String,
      type       : String
    }
  }
</script>