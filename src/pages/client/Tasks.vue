<template>
  <div>
    <NewTaskModal :stories-list="storyKeys"/>
    <EditTaskModal :task="selectedTask"/>
    <div class="d-flex justify-content-between mb-2">
      <h6 class="card-title">Tareas</h6>
      <button class="btn btn-primary btn-icon-text"
        data-target="#NewTaskModal"
        data-toggle="modal">
        <i class="btn-icon-prepend" data-feather="plus-circle"></i>
        Nueva tarea
      </button>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column"
            v-if="tasks.length > 0">
            <transition name="fade">
              <div v-if="storyKey">
                <h4 class="card-title mb-2 mt-3">{{ story }}</h4>
              </div>
            </transition>
            <transition-group name="fade">
              <task-list-item v-for="task in tasks"
                :key="task.key"
                :task="task"
                @show="() => show(task.key)">
              </task-list-item>
            </transition-group>
          </div>
          <div class="alert alert-warning d-flex" role="alert" v-else>
            No hay tareas registradas para este proyecto.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import { UsersMixin } from "@/mixins/users"
  import EditTaskModal from "@/components/modals/EditTaskModal"
  import NewTaskModal from "@/components/modals/NewTaskModal"
  import TaskListItem from "@/components/TaskListItem"
  export default {
    components: {
      EditTaskModal,
      NewTaskModal,
      TaskListItem
    },
    mixins: [
      UsersMixin
    ],
    data() {
      return {
        rootRef     : DATABASE.ref(),
        selectedTask: null,
        taskIndex   : null,
        tasksRef    : null,
        story: null,
        storyKeys: [],
        storyKeysOnChildAdded: null,
        storyKeysOnChildRemoved: null,
        storyKeysRef: null,
        tasks: [],
        tasksOnChildAdded: null,
        tasksOnChildChanged: null,
        tasksOnChildRemoved: null,
        tasksRef: null
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
        if (this.tasksRef) {
          this.unsubscribeToTasks()
          this.tasksRef = null
          this.subscribeToTasks()
        }
      }
    },
    methods: {
      show(TaskKey) {
        this.taskIndex = this.tasks.findIndex(x => x.key == TaskKey)
        if (this.taskIndex > -1) {
          this.selectedTask = this.tasks[this.taskIndex]
          $("#EditTaskModal").modal("show")
        }
      },
      subscribeToStoryKeys() {
        this.storyKeysRef = this.rootRef.child(`/client-stories/${ this.slug }`)
        this.storyKeysOnChildAdded = this.storyKeysRef.on("child_added", async snapshot => {
          const { key } = snapshot
          const StoryLabel = (
            await this.rootRef.child(`/stories/${ key }/data/title`)
              .once("value")
          ).val()
          this.storyKeys.push({
            label: StoryLabel,
            value: key
          })
        })
        this.storyKeysOnChildRemoved = this.storyKeysRef.on("child_removed", snapshot => {
          const index = this.storyKeys.findIndex(x => x.value == snapshot.key)
          if (index > -1) {
            this.storyKeys.splice(index, 1)
          }
        })
      },
      unsubscribeToStoryKeys() {
        this.storyKeysRef.off("child_added", this.storyKeysOnChildAdded)
        this.storyKeysRef.off("child_removed", this.storyKeysOnChildRemoved)
      },
      async subscribeToTasks() {
        this.tasks = []
        this.story = null

        if (this.storyKey) {

          try {
            this.story = (
              await this.rootRef.child(`/stories/${ this.storyKey }/data/title`)
                .once("value")
            ).val()
          } catch (ex) {
            this.story = {}
          }

          this.tasksRef = this.rootRef.child("/tasks")
            .orderByChild("storyKey")
            .equalTo(this.storyKey)
        } else {
          this.tasksRef = this.rootRef.child("/tasks")
            .orderByChild("clientKey")
            .equalTo(this.slug)
        }

        
          
          
        this.storyKeysOnChildAdded = this.tasksRef.on("child_added", async snapshot => {
          const Task = snapshot.val()
          Task.key = snapshot.key
          Task.createdByName = await this.getUserProfileName(Task.createdBy)
          this.tasks.push(Task)
        })
        this.storyKeysOnChildChanged = this.tasksRef.on("child_changed", snapshot => {
          const index = this.tasks.findIndex(x => x.key == snapshot.key)
          if (index > -1) {
            this.$set(this.tasks, index, Object.assign(this.tasks[index], snapshot.val()))
          }
        })
        this.storyKeysOnChildRemoved = this.tasksRef.on("child_removed", snapshot => {
          const index = this.tasks.findIndex(x => x.key == snapshot.key)
          if (index > -1) {
            this.$delete(this.tasks, index)
          }
        })
      },
      unsubscribeToTasks() {
        this.tasksRef.off("child_added", this.storyKeysOnChildAdded)
        this.tasksRef.off("child_changed", this.storyKeysOnChildChanged)
        this.tasksRef.off("child_removed", this.storyKeysOnChildRemoved)
      }
    },
    created() {
      this.subscribeToStoryKeys()
      this.subscribeToTasks()
    },
    mounted() {
      feather.replace()
    },
    beforeDestroy() {
      this.unsubscribeToStoryKeys()
      this.unsubscribeToTasks()
    }
  }
</script>

<style scoped>
  .custom-card-title {
    color: #aaaaaa;
    font-size: 12px;
  }
</style>