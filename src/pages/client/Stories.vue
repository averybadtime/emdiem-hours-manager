<template>
  <div>
    <NewStoryModal/>
    <EditStoryModal @storyInfoUpdated="storyInfoUpdated" :story="selectedStory"/>
    <div class="d-flex justify-content-between">
      <h6 class="card-title mb-2">Historias</h6>
      <button v-if="$isAdmin()"
        class="btn btn-primary btn-icon-text mb-2"
        data-target="#NewStoryModal"
        data-toggle="modal">
        <i class="btn-icon-prepend" data-feather="plus-circle"></i>
        Nueva historia
      </button>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column"
            v-if="stories.length > 0">
            <transition-group name="fade">
              <StoryListItem @show="show"
                v-for="story in stories"
                :key="story.key"
                :story="story"/>
            </transition-group>
          </div>
          <div class="alert alert-warning d-flex" role="alert" v-else>
            No hay historias registradas para este proyecto.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import { UsersMixin } from "@/mixins/users"
  import EditStoryModal from "@/components/modals/EditStoryModal"
  import NewStoryModal from "@/components/modals/NewStoryModal"
  import StoryListItem from "@/components/StoryListItem"
  export default {
    components: {
      EditStoryModal,
      NewStoryModal,
      StoryListItem
    },
    mixins: [
      UsersMixin
    ],
    data() {
      return {
        rootRef              : DATABASE.ref(),
        selectedStory        : null,
        stories              : [],
        clientStoriesRef     : null,
        storiesOnChildAdded  : null,
        storiesOnChildRemoved: null
      }
    },
    methods: {
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
      show(key) {
        const index = this.stories.findIndex(x => x.key == key)
        if (index > -1) {
          this.selectedStory = this.stories[index]
          $("#EditStoryModal").modal("show")
        }
      },
      storyInfoUpdated(UpdatedStory) {
        const index = this.stories.findIndex(x => x.key == UpdatedStory.key)
        if (index > -1) {
          Object.assign(this.stories[index], UpdatedStory)
        }
      },
      subscribeToStories() {
        const { slug } = this.$route.params
        this.clientStoriesRef = this.rootRef.child(`/client-stories/${ slug }`)
        this.storiesOnChildAdded = this.clientStoriesRef.on("child_added", async snapshot => {
          const { key }             = snapshot
          const Story               = await this.getStory(key)
          const name                = await this.getUserProfileName(Story.createdBy)
                Story.key           = key
                Story.createdByName = name
          this.stories.push(Story)
        })
        this.storiesOnChildRemoved = this.clientStoriesRef.on("child_removed", snapshot => {
          const index = this.stories.findIndex(x => x.key == snapshot.key)
          this.$delete(this.stories, index)
        })
      },
      unsubscribeToStories() {
        this.clientStoriesRef.off("child_added", this.storiesOnChildAdded)
        this.clientStoriesRef.off("child_removed", this.storiesOnChildRemoved)
      }
    },
    created() {
      this.subscribeToStories()
    },
    mounted() {
      feather.replace()
    },
    beforeDestroy() {
      this.unsubscribeToStories()
    }
  }
</script>