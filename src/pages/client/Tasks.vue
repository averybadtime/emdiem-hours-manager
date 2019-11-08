<template>
  <div>
    <EditTaskModal @taskInfoUpdated="taskInfoUpdated" :task="selectedTask"/>
    <div class="d-flex justify-content-between">
      <h6 class="card-title mb-2">Tareas</h6>
      <button class="btn btn-primary btn-icon-text mb-2"
        data-target="#NewStoryModal"
        data-toggle="modal">
        <i class="btn-icon-prepend" data-feather="plus-circle"></i>
        Nueva tarea
      </button>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column">
            <transition-group name="fade">
              <div v-for="story in stories"
                :key="story.key">
                <div v-if="story.tasks.length > 0" class="mb-5">
                  <h6 class="card-title custom-card-title mb-0">{{ story.title }}</h6>
                  <transition-group name="fade">
                    <TaskListItem @show="() => show(story.key, task.key)"
                      v-for="task in story.tasks"
                      :key="task.key"
                      :task="task"/>
                  </transition-group>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import EditTaskModal from "@/components/modals/EditTaskModal"
  import TaskListItem from "@/components/TaskListItem"
  export default {
    components: {
      EditTaskModal,
      TaskListItem
    },
    data() {
      return {
        rootRef     : DATABASE.ref(),
        selectedTask: null,
        stories     : [],
        storyIndex  : null,
        taskIndex   : null,
        tasksRef    : null
      }
    },
    computed: {
      client() {
        return this.$parent.client
      },
      slug() {
        return this.$route.params.slug
      },
      storyKey() {
        return this.$route.params.story_key
      }
    },
    watch: {
      "$route"(next) {
        this.fetchTasks()
      }
    },
    methods: {
      async fetchStoryData(StoryKey) {
        try {
          return (
            await this.rootRef.child(`/stories/${ StoryKey }/data`)
              .once("value")
          ).val()
        } catch (ex) {
          throw ex
        }
      },
      async fetchStoryTaskKeys(StoryKey) {
        try {
          return (
            await this.rootRef.child(`/stories/${ StoryKey }/tasks`)
              .once("value")
          ).val()
        } catch (ex) {
          throw ex
        }
      },
      async fetchTask(TaskKey) {
        try {
          return (
            await this.rootRef.child(`/tasks/${ TaskKey }`)
              .once("value")
          ).val()
        } catch (ex) {
          throw ex
        }
      },
      async fetchFullStory(StoryKey) {
        try {
          const story = await this.fetchStoryData(StoryKey)
          story.key = StoryKey
          story.tasks = []
          const StoryTaskKeys = await this.fetchStoryTaskKeys(StoryKey)
          for (const TaskKey in StoryTaskKeys) {
              const task               = await this.fetchTask(TaskKey)
                    task.key           = TaskKey
                    task.createdByName = "J"
              story.tasks.push(task)
            }
            return story
        } catch (ex) {
          throw ex
        }
      },
      async fetchTasks() {
        this.stories = []
        if (this.storyKey) {
          try {
            const story = await this.fetchFullStory(this.storyKey)
            this.stories.push(story)
          } catch (ex) {
            console.error(ex)
          }
        } else {
          try {
            const ClientStories = (
              await this.rootRef.child(`/client-stories/${ this.slug }`)
                .once("value")
            ).val()
            for (const StoryKey in ClientStories) {
              const story = await this.fetchFullStory(StoryKey)
              this.stories.push(story)
            }
          } catch (ex) {
            console.error(ex)
          }
        }
      },
      show(StoryKey, TaskKey) {
        this.storyIndex = this.stories.findIndex(x => x.key == StoryKey)
        if (this.storyIndex > -1) {
          this.taskIndex = this.stories[this.storyIndex].tasks.findIndex(x => x.key == TaskKey)
          if (this.taskIndex > -1) {
            console.log(this.storyIndex, this.taskIndex)
            this.selectedTask = this.stories[this.storyIndex].tasks[this.taskIndex]
            $("#EditTaskModal").modal("show")
          }
        }
      },
      taskInfoUpdated(UpdatedTask) {
        console.log(this.storyIndex, this.taskIndex)
        if (this.storyIndex && this.taskIndex) {
          Object.assign(this.stories[this.storyIndex].tasks[this.taskIndex], UpdatedTask)
        }
        this.storyIndex = null
        this.taskIndex  = null
      }
    },
    created() {
      this.fetchTasks()
    },
    mounted() {
      feather.replace()
    }
  }
</script>
<style scoped>
  .custom-card-title {
    color: #aaaaaa;
    font-size: 12px;
  }
</style>