<template>
  <div>
    <h6 class="card-title">Dashboard</h6>
    <div class="row">
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <stat-card
          description="Horas consumidas"
          :stat="consumedHours"
          title="Consumidas"
          type="primary"
        ></stat-card>
      </div>
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <stat-card
          description="Horas disponibles"
          :stat="availableHours"
          title="Disponibles"
          type="danger"
        ></stat-card>
      </div>
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <stat-card
          description="Historias en total"
          :stat="storiesCount"
          title="Historias"
          type="success"
        ></stat-card>
      </div>
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <stat-card
          description="Tareas en total"
          :stat="tasksCount"
          title="Tareas"
          type="warning"
        ></stat-card>
      </div>
      <div class="col-md-12 col-lg-6 grid-margin mt-2">
        <h6 class="card-title mb-3">Últimas historias</h6>
        <ul class="list-group"
          v-if="lastestStories.length > 0">
          <li
            class="list-group-item d-flex justify-content-between"
            v-for="(story, index) in lastestStories"
            :key="index">
            {{ story.title }}
            <h5><span class="badge badge-primary">{{ story.level }}</span></h5>
          </li>
        </ul>
        <div class="alert alert-warning"
          role="alert"
          v-else>
          No se encontraron historias
        </div>
      </div>
      <div class="col-lg-12 col-xl-6 grid-margin mt-2">
        <h6 class="card-title mb-3">Últimas tareas</h6>
        <div class="table-responsive"
          v-if="lastestTasks.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Duración (hs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in lastestTasks"
                :key="index">
                <td v-text="task.title"></td>
                <td>
                  <span class="badge badge-primary">{{ task.hours }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="alert alert-warning"
          role="alert"
          v-else>
          No se encontraron tareas
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import moment from "moment"
  import StatCard from "@/components/StatCard"
  export default {
    components: {
      StatCard
    },
    data() {
      return {
        adquiredHours: null,
        consumedHours: null,
        lastestStories: [],
        lastestTasks: [],
        rootRef: DATABASE.ref(),
        storiesCount: null,
        tasksCount: null
      }
    },
    computed: {
      availableHours() {
        return this.client.availableHours ? this.client.availableHours : 0
      },
      client() {
        const index = this.$store.state.clients.findIndex(x => x.key == this.slug)
        if (index > -1) {
          return this.$store.state.clients[index]
        }
        return {}
      },
      slug() {
        return this.$route.params.slug
      }
    },
    watch: {
      "$route.params.slug"(next) {
        this.fetch()
        feather.replace()
      }
    },
    methods: {
      async fetch() {
        this.getConsumedHours()
        this.getTotalStories()
        this.getTotalTasks()
        this.getLastestStories()
        this.getLastestTasks()
      },
      async getConsumedHours() {
        this.consumedHours = "..."
        try {
          const Tasks = (
            await this.rootRef.child(`/tasks`)
              .orderByChild("clientKey")
              .equalTo(this.slug)
              .once("value")
          ).val()
          let count = 0
          for (const Key in Tasks) {
            const { hours } = Tasks[Key]
            count += hours
          }
          this.consumedHours = count
        } catch (ex) {
          console.error("Error obteniendo las horas consumidas - ERROR: ", ex)
        }
      },
      async getLastestStories() {
        this.lastestStories = []
        try {
          const StoryKeys = (
            await this.rootRef.child(`/client-stories/${ this.slug }`)
              .limitToLast(5)
              .once("value")
          ).val()
          for (const key in StoryKeys) {
            const { level, title } = (
              await this.rootRef.child(`/stories/${ key }/data`)
                .once("value")
            ).val()
            this.lastestStories.push({ level, title })
          }
        } catch (ex) {
          console.error("Error obteniendo las últimas historias. ERROR:", ex)
        }
      },
      async getLastestTasks() {
        this.lastestTasks = []
        try {
          const Tasks = (
            await this.rootRef.child("/tasks")
              .orderByChild("clientKey")
              .equalTo(this.slug)
              .limitToLast(5)
              .once("value")
          ).val()
          for (const key in Tasks) {
            const { title, hours } = Tasks[key]
            this.lastestTasks.push({ title, hours })
          }
        } catch (ex) {
          console.error("Error obteniendo las últimas tareas. ERROR:", ex)
        }
      },
      async getTotalStories() {
        this.storiesCount = "..."
        try {
          this.storiesCount = (
            await this.rootRef.child(`/client-stories/${ this.slug }`)
              .once("value")
          ).numChildren()
        } catch (ex) {
          console.error("Error obteniendo las historias totales - ERROR: ", ex)
        }
      },
      async getTotalTasks() {
        this.tasksCount = "..."
        try {
          this.tasksCount = (
            await this.rootRef.child("tasks")
              .orderByChild("clientKey")
              .equalTo(this.slug)
              .once("value")
          ).numChildren()
        } catch (ex) {
          console.error("Error obteniendo las tareas totales - ERROR: ", ex)
        }
      }
    },
    created() {
      this.fetch()
    },
    mounted() {
      feather.replace()
    }
  }
</script>