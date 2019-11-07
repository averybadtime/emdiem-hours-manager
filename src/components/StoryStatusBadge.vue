<template>
  <span :class="`badge ${ statusCssClass } mr-1`">{{ statusLabel }}</span>
</template>

<script>
  export default {
    props: {
      status: String
    },
    computed: {
      statusLabel() {
        return this.$store.state.storyStates[this.status]
      },
      statusCssClass() {
        switch (this.status) {
          case "_PENDING": return "badge-warning"
          case "_IN_PROGRESS": return "badge-primary"
          case "_QA": return "badge-info"
          case "_DONE": return "badge-success"
          case "_STUCK": return "badge-danger"
        }
      }
    }
  }
</script>