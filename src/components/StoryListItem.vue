<template>
  <a @click.prevent="$emit('show', story.key)"
    class="d-flex align-items-center border-bottom py-3"
    >
    <div class="mr-3">
      <div class="LetterCircle rounded-circle wd-35">{{ createdByLetter }}</div>
    </div>
    <div class="w-100">
      <div class="d-flex justify-content-between">
        <h6 class="text-body mb-2">{{ story.title }}</h6>
        <p class="text-muted tx-12">{{ story.createdAt | date("DD/MM/YYYY") }}</p>
      </div>
      <p class="text-muted tx-13">{{ story.description }}</p>
    </div>
  </a>
</template>

<script>
  export default {
    props: {
      story: Object
    },
    computed: {
      createdByLetter() {
        return this.story ? this.story.createdByName[0] : "..."
      }
    }
  }
</script>