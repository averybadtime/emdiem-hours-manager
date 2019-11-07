<template>
  <a @click.prevent="$emit('show', story.key)"
    class="d-flex align-items-center border-bottom py-3"
    >
    <div class="mr-3">
      <div class="LetterCircle rounded-circle wd-35">{{ createdByLetter }}</div>
    </div>
    <div class="w-100">
      <div class="d-flex justify-content-between">
        <h6 class="text-body mb-2">
          <StoryStatusBadge :status="story.status"/>
          {{ story.title }}
        </h6>
        <p class="text-muted tx-12">{{ story.createdAt | date("DD/MM/YYYY") }}</p>
      </div>
      <p class="text-muted tx-13 mb-2">{{ story.description }}</p>
      <router-link :to="{ name: 'CLIENT_TASKS', params: { story_key: story.key } }">Ver tareas enlazadas</router-link>
    </div>
  </a>
</template>

<script>
  import StoryStatusBadge from "@/components/StoryStatusBadge"
  export default {
    components: {
      StoryStatusBadge
    },
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