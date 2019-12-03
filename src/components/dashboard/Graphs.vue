<template>
  <div class="page-content-2">
    <div class="row">
      <div class="col-md-4 mb-4"
        v-if="!$isDev()">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Recuento de horas adquiridas</h6>
            <apex-chart v-if="!loadingTransactions" height="250" type="area" :series="areaSeries" :options="areaOptions"/>
          </div>
        </div>
      </div>
      <div :class="`${ $isDev() ? 'col-md-6' : 'col-md-4' } mb-4`">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Reporte de historias</h6>
            <apex-chart v-if="!loadingStories" height="250" type="bar" :series="bar2Series" :options="bar2Options"/>
          </div>
        </div>
      </div>
      <div :class="`${ $isDev() ? 'col-md-6' : 'col-md-4' } mb-4`">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Reporte de tareas por proyecto</h6>
            <apex-chart v-if="!loadingTasks" height="250" type="bar" :series="barSeries" :options="barOptions"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import ApexChart from "vue-apexcharts"
  export default {
    components: {
      ApexChart
    },
    data() {
      return {
        clients: null,
        loadingStories: true,
        loadingTasks: true,
        loadingTransactions: true,
        areaOptions: {
          dataLabels: {
            enabled: false
          },
          chart: {
            toolbar: {
              show: false
            }
          },
          tooltip: {
            theme: "dark"
          },
          xaxis: {
            labels: {
              show: false
            }
          }
        },
        areaSeries: [],
        barOptions: {
          chart: {
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: true
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          xaxis: {
            categories:[]
          }
        },
        barSeries: [{
          data: []
        }],
        bar2Series: [{
          data: []
        }],
        bar2Options: {
          chart: {
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: true
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          xaxis: {
            categories:[]
          }
        },
        rootRef: DATABASE.ref()
      }
    },
    methods: {
      async getProjects() {
        try {
          let Projects
          if (this.$isAdmin()) {
            const AllProjects = (
              await this.rootRef.child("clients")
                .once("value")
            ).val()
            const ProjectKeys = {}
            for (const key in AllProjects) {
              ProjectKeys[key] = true
            }
            Projects = ProjectKeys
          } else {
            Projects = (
              await this.rootRef.child(`projects-by-user/${ this.$store.state.user.uid }`)
                .once("value")
            ).val()
          }
          this.clients = Projects
        } catch(ex) {
          console.error(ex)
        }
      },
      async getStories() {
        try {
          const categories = []
          const result     = []
          try {
            const ProjectsByUser = (
              await this.rootRef.child(`projects-by-user/${ this.$store.state.user.uid }`)
                .once("value")
            ).val()
            for (const ProjectKey in this.clients) {
              const StoriesQuantity = (
                await this.rootRef.child(`client-stories/${ ProjectKey }`)
                  .once("value")
              ).numChildren()
              const ProjectName = (
                await this.rootRef.child(`clients/${ ProjectKey }/name`)
                .once("value")
              ).val() || "No encontrado"
              categories.push(ProjectName)
              result.push(StoriesQuantity)
            }
          } catch(ex) {
            console.log(ex)
          }
          this.$set(this.bar2Options.xaxis, "categories", categories)
          this.$set(this.bar2Series[0], "data", result)
          this.loadingStories = false
        } catch(ex) {
          console.error(ex)
        }
      },
      async getTransactionsData() {
        try {
          const ProjectsByUser = (
            await this.rootRef.child(`/projects-by-user/${ this.$store.state.user.uid }`)
              .once("value")
          ).val()
          for (const ProjectKey in this.clients) {
            const Transactions = (
              await this.rootRef.child(`/transactions/${ ProjectKey }`)
                .limitToLast(5)
                .once("value")
            ).val()
            const ProjectName = (
              await this.rootRef.child(`clients/${ ProjectKey }/name`)
              .once("value")
            ).val() || "No encontrado"
            const data = []
            for (const TransactionKey in Transactions) {
              data.push(Transactions[TransactionKey].hours)
            }
            this.$set(this.areaSeries, this.areaSeries.length, {
              name: ProjectName,
              data
            })
          }
          this.loadingTransactions = false
        } catch(ex) {
          console.log(ex)
        }
      },
      async getTasks() {
        const categories = []
        const result     = []
        try {
          const ProjectsByUser = (
            await this.rootRef.child(`projects-by-user/${ this.$store.state.user.uid }`)
              .once("value")
          ).val()
          for (const ProjectKey in this.clients) {
            const TasksQuantity = (
              await this.rootRef.child("tasks")
                .orderByChild("clientKey")
                .equalTo(ProjectKey)
                .once("value")
            ).numChildren()
            const ProjectName = (
              await this.rootRef.child(`clients/${ ProjectKey }/name`)
              .once("value")
            ).val() || "No encontrado"
            categories.push(ProjectName)
            result.push(TasksQuantity)
          }
        } catch(ex) {
          console.log(ex)
        }
        this.$set(this.barOptions.xaxis, "categories", categories)
        this.$set(this.barSeries[0], "data", result)
        this.loadingTasks = false
      }
    },
    async created() {
      await this.getProjects()
      await this.getStories()
      await this.getTasks()
      if (! this.$isDev()) {
        await this.getTransactionsData()
      }
    }
  }
</script>