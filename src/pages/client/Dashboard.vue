<template>
  <div>
    <h6 class="card-title">Dashboard</h6>
    <div class="row">
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-baseline">
              <h6 class="card-title mb-0 text-white">Adquiridas</h6>
              <div class="dropdown mb-2">
                <button class="btn p-0" type="button" id="hours" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="icon-lg text-white pb-3px" data-feather="more-horizontal"></i>
                </button>
                <div class="dropdown-menu" aria-labelledby="hours">
                  <router-link to="/actividad" class="dropdown-item d-flex align-items-center">
                    <i class="icon-sm mr-2" data-feather="activity"></i>
                    Ver actividad
                  </router-link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6 col-md-12">
                <h3 class="mb-2">{{ consumedHours }}</h3>
                <div class="d-flex align-items-baseline">
                  <p>Horas consumidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-baseline">
              <h6 class="card-title mb-0 text-white">Disponibles</h6>
              <div class="dropdown mb-2">
                <button class="btn p-0" type="button" id="hours" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="icon-lg text-white pb-3px" data-feather="more-horizontal"></i>
                </button>
                <div class="dropdown-menu" aria-labelledby="hours">
                  <router-link to="/actividad" class="dropdown-item d-flex align-items-center">
                    <i class="icon-sm mr-2" data-feather="activity"></i>
                    Ver actividad
                  </router-link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6 col-md-12">
                <h3 class="mb-2">{{ availableHours }}</h3>
                <div class="d-flex align-items-baseline">
                  <p>Horas disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-baseline">
              <h6 class="card-title mb-0 text-white">Historias</h6>
              <div class="dropdown mb-2">
                <button class="btn p-0" type="button" id="hours" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="icon-lg text-white pb-3px" data-feather="more-horizontal"></i>
                </button>
                <div class="dropdown-menu" aria-labelledby="hours">
                  <router-link to="/actividad" class="dropdown-item d-flex align-items-center">
                    <i class="icon-sm mr-2" data-feather="activity"></i>
                    Ver actividad
                  </router-link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6 col-md-12">
                <h3 class="mb-2">{{ storiesCount }}</h3>
                <div class="d-flex align-items-baseline">
                  <p>Historias en total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 grid-margin stretch-card">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-baseline">
              <h6 class="card-title mb-0 text-white">Tareas</h6>
              <div class="dropdown mb-2">
                <button class="btn p-0" type="button" id="hours" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="icon-lg text-white pb-3px" data-feather="more-horizontal"></i>
                </button>
                <div class="dropdown-menu" aria-labelledby="hours">
                  <router-link to="/actividad" class="dropdown-item d-flex align-items-center">
                    <i class="icon-sm mr-2" data-feather="activity"></i>
                    Ver actividad
                  </router-link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6 col-md-12">
                <h3 class="mb-2">{{ tasksCount }}</h3>
                <div class="d-flex align-items-baseline">
                  <p>Tareas en total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  export default {
    data() {
      return {
        adquiredHours: null,
        availableHours: null,
        consumedHours: null,
        rootRef: DATABASE.ref(),
        storiesCount: null,
        tasksCount: null
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug
      }
    },
    methods: {
      async getAcquiredHours() {
        try {
          const LastActivity = (
            await this.rootRef.child(`/transactions/${ this.slug }/`)
              .limitToLast(5)
              .once("value")
          ).val()
          const ChartData = {
            labels: [],
            values: []
          }
          for (const key in LastActivity) {
            const Transaction = LastActivity[key]
            ChartData.labels.push(moment(Transaction.createdAt).calendar())
            ChartData.values.push(Transaction.hours)
          }
        } catch (ex) {
          console.error(ex)
        }
      },
      async getAvailableHours() {
        try {
          this.availableHours = (
            await this.rootRef.child(`/clients/${ this.slug }/availableHours`)
              .once("value")
          ).val() || 0
        } catch (ex) {
          console.error(ex)
        }
      },
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
          console.error(ex)
        }
      },
      async getTotalStories() {
        try {
          this.storiesCount = (
            await this.rootRef.child(`/client-stories/${ this.slug }`)
              .once("value")
          ).numChildren()
        } catch (ex) {
          console.error(ex)
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
          console.error(ex)
        }
      }
    },
    created() {
      this.getAcquiredHours()
      this.getAvailableHours()
      this.getConsumedHours()
      this.getTotalStories()
      this.getTotalTasks()
    },
    mounted() {
      feather.replace()
    }
  }
</script>