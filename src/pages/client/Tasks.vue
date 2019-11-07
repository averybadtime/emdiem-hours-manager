<template>
  <h1>{{ storyKey }}</h1>
</template>

<script>
  export default {
    computed: {
      storyKey() {
        return this.$route.params.story_key
      }
    }
  }
</script>