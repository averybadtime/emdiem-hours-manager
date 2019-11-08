<template>
  <a @click="$emit('show')"
    class="d-flex align-items-center border-bottom py-3">
    <div class="mr-3">
      <div class="LetterCircle rounded-circle wd-35">{{ createdByLetter }}</div>
    </div>
    <div class="w-100">
      <div class="d-flex justify-content-between">
        <h6 class="text-body mb-2">
          {{ task.title }}
        </h6>
        <p class="text-muted tx-12">{{ task.createdAt | date("DD/MM/YYYY") }}</p>
      </div>
      <p class="text-muted tx-13">{{ task.description }}</p>
    </div>
  </a>
</template>

<script>
  export default {
    props: {
      task: Object
    },
    computed: {
      createdByLetter() {
        return this.task ? this.task.createdByName[0] : "..."
      }
    }
  }
</script>