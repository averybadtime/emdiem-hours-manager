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
      <div class="col-md-12 col-lg-8 grid-margin mt-2">
        <h6 class="card-title mb-2">Participantes</h6>
        <div v-for="(item, index) in new Array(5).fill('Element')"
          :key="index"
          class="d-flex align-items-center border-bottom py-3">
          <div class="mr-3">
            <div class="LetterCircle rounded-circle wd-35">E</div>
          </div>
          <div class="w-100">
            <div class="d-flex justify-content-between">
              <h6 class="text-body mb-2">
                {{ item }} {{ index }}
              </h6>
              <p class="text-muted tx-12">{{ item }} {{ index }}</p>
            </div>
            <p class="text-muted tx-13">{{ item }} {{ index }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-12 col-lg-4 grid-margin mt-2">
        Contenido opcional
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
        rootRef: DATABASE.ref(),
        storiesCount: null,
        tasksCount: null
      }
    },
    computed: {
      availableHours() {
        const index = this.$store.state.clients.findIndex(x => x.key == this.slug)
        if (index > -1) {
          return this.$store.state.clients[index].availableHours || 0
        }
        return 0
      },
      slug() {
        return this.$route.params.slug
      }
    },
    methods: {
      async getConsumedHours() {
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
      async getTotalStories() {
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
      this.getConsumedHours()
      this.getTotalStories()
      this.getTotalTasks()
    },
    mounted() {
      feather.replace()
    }
  }
</script>