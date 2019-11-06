<template>
  <div>
    <EditStoryModal :story="selectedStory"/>
    <h6 class="card-title mb-2">Historias</h6>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column">
            <transition-group name="fade">
              <StoryListItem @show="show"
                v-for="story in stories"
                :key="story.key"
                :story="story"/>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import EditStoryModal from "@/components/modals/EditStoryModal"
  import StoryListItem from "@/components/StoryListItem"
  export default {
    components: {
      EditStoryModal,
      StoryListItem
    },
    data() {
      return {
        rootRef      : DATABASE.ref(),
        selectedStory: null,
        stories      : []
      }
    },
    methods: {
      async fetchStories() {
        const { slug } = this.$route.params
        try {
          const StoriesData = (
            await this.rootRef.child(`/client-stories/${ slug }`)
              .once("value")
          ).val()
          for (const key in StoriesData) {

            const Story = await this.getStory(key)
            const name = await this.getCreatedByName(Story.createdBy)

            Story.key = key
            Story.createdByName = name

            this.stories.push(Story)
          }
        } catch (ex) {
          console.error(ex)
        }
      },
      async getStory(key) {
        try {
          return (
            await this.rootRef.child(`/stories/${ key }/data`)
              .once("value")
          ).val()
        } catch (ex) {
          throw ex
        }
      },
      async getCreatedByName(uid) {
        try {
          return (
            await this.rootRef.child(`/profiles/${ uid }/name`)
              .once("value")
          ).val()
        } catch (ex) {
          throw ex
        }
      },
      show(key) {
        const index = this.stories.findIndex(x => x.key == key)
        if (index > -1) {
          this.selectedStory = this.stories[index]
          $("#EditStoryModal").modal("show")
        }
      }
    },
    created() {
      this.fetchStories()
    }
  }
</script>