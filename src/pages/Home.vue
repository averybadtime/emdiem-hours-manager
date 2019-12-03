<template>
  <div class="page-content">
    <AddHoursModal/>
    <NewClientModal/>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-3 mb-md-0">Dashboard</h4>
      <div class="d-flex align-items-center flex-wrap text-nowrap"
        v-if="$isAdmin()">
        <button type="button"
          class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0 mr-2"
          @click="showAddHoursModal">
          <i class="btn-icon-prepend" data-feather="plus-circle"></i>
          Nueva compra de horas
        </button>
        <button type="button"
          class="btn btn-primary btn-icon-text mb-2 mb-md-0"
          @click="showNewClientModal">
          <i data-feather="user-plus" class="btn-icon-prepend"></i>
          Nuevo cliente
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-6 col-md-3 grid-margin stretch-card">
        <stat-card
          description="Todos los usuarios"
          title="Usuarios"
          type="primary"
          :stat="usersCount"
        ></stat-card>
      </div>
      <div class="col-6 col-md-3 grid-margin stretch-card">
        <stat-card
          description="Todos los clientes registrados"
          title="Clientes"
          type="danger"
          :stat="$store.state.clients.length"
        ></stat-card>
      </div>
      <div class="col-6 col-md-3 grid-margin stretch-card">
        <stat-card
          description="Recaudo de todos los clientes"
          title="Recaudo"
          type="success"
          :stat="$options.filters.currency(totalAmount)"
        ></stat-card>
      </div>
      <div class="col-6 col-md-3 grid-margin stretch-card">
        <stat-card
          description="Todos los clientes registrados"
          title="Clientes"
          type="warning"
          :stat="$store.state.clients.length"
        ></stat-card>
      </div>
    </div>
    <graphs-dashboard/>
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="card-title">Clientes</div>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <th>Cliente</th>
                  <th>Fecha de creación</th>
                  <th>Historias</th>
                  <th>Tareas</th>
                  <th>Recaudo total ($)</th>
                </thead>
                <tbody>
                  <tr v-for="(client, index) in localClients"
                    :key="index">
                    <td v-text="client.name"></td>
                    <td>{{ client.createdAt | date("DD-MM-YYYY") }}</td>
                    <td v-text="client.stories"></td>
                    <td v-text="client.tasks"></td>
                    <td>
                      <span :class="`badge badge-${ client.amount == 0 ? 'danger' : 'success' }`">{{ client.amount | currency }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Últimas historias</h6>
            <story-list-item v-for="story in lastestStories"
              :key="story.key"
              :story="story"
              no-tasks>
            </story-list-item>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Últimas tareas</h6>
            <task-list-item v-for="task in lastestTasks"
              :key="task.key"
              :task="task">
            </task-list-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import { ClientsMixin } from "@/mixins/clients"
  import { UsersMixin } from "@/mixins/users"
  import AddHoursModal from "@/components/modals/AddHoursModal"
  import GraphsDashboard from "@/components/dashboard/Graphs"
  import NewClientModal from "@/components/modals/NewClientModal"
  import StoryListItem from "@/components/StoryListItem"
  import StatCard from "@/components/StatCard"
  import TaskListItem from "@/components/TaskListItem"
  export default {
    components: {
      AddHoursModal,
      GraphsDashboard,
      NewClientModal,
      StoryListItem,
      StatCard,
      TaskListItem
    },
    mixins: [
      ClientsMixin,
      UsersMixin
    ],
    data() {
      return {
        clients       : null,
        lastestStories: [],
        lastestTasks  : [],
        localClients  : [],
        rootRef       : DATABASE.ref(),
        totalAmount   : null,
        usersCount    : null
      }
    },
    methods: {
      async getClientStats() {
        try {
          let Clients = this.$isAdmin() ?
            (await this.rootRef.child("clients").once("value")).val() :
            (await this.rootRef.child(`projects-by-user/${ this.$store.state.user.uid }`).once("value")).val()
          for (const ClientKey in Clients) {
            const stories   = await this.getClientStories(ClientKey)
            const tasks     = await this.getClientTasks(ClientKey)
            const amount    = await this.getClientAmount(ClientKey)
            const createdAt = (await this.rootRef.child(`clients/${ ClientKey }/createdAt`).once("value")).val()
            const name      = (await this.rootRef.child(`clients/${ ClientKey }/name`).once("value")).val()
            this.localClients.push({
              amount,
              createdAt,
              name,
              stories,
              tasks
            })
          }
        } catch(ex) {
          console.error(ex)
        }
      },
      async getClientAmount(clientKey) {
        try {
          const Transactions = (
            await this.rootRef.child(`/transactions/${ clientKey }`)
              .once("value")
          ).val()
          let totalAmount = 0
          for (const key in Transactions) {
            const Transaction = Transactions[key]
            if (Transaction.amount) {
              totalAmount += Transaction.amount
            }
          }
          return totalAmount
        } catch (ex) {
          console.error(ex)
        }
      },
      async getClientStories(clientKey) {
        try {
          return (
            await this.rootRef.child(`/client-stories/${ clientKey }`)
              .once("value")
          ).numChildren()
        } catch (ex) {
          return "---"
        }
      },
      async getClientTasks(clientKey) {
        try {
          return (
            await this.rootRef.child(`/tasks`)
              .orderByChild("clientKey")
              .equalTo(clientKey)
              .once("value")
          ).numChildren()
        } catch (ex) {
          return "---"
        }
      },
      async getLastestStories() {
        if (this.$isAdmin()) {
          try {
            const lastestStories = (await this.rootRef.child("stories").limitToLast(5).once("value")).val()
            for (const key in lastestStories) {
              const Story               = lastestStories[key].data
                    Story.key           = key
                    Story.createdByName = await this.getUserProfileName(Story.createdBy)
              this.lastestStories.unshift(Story)
            }
          } catch (ex) {
            console.error(ex)
          }
        } else {
          const lastestStories = {}
          for (const ClientKey in this.clients) {
            const LastStoryOfThisClient = (await this.rootRef.child(`client-stories/${ ClientKey }`).limitToLast(1).once("value")).val()
            if (LastStoryOfThisClient) {
              const Key = Object.keys(LastStoryOfThisClient).pop()
              lastestStories[Key] = true
            }
          }
          for (const key in lastestStories) {
            const Story               = (await this.rootRef.child(`stories/${ key }/data`).once("value")).val()
                  Story.key           = key
                  Story.createdByName = await this.getUserProfileName(Story.createdBy)
            this.lastestStories.unshift(Story)
          }
        }
      },
      async getLastestTasks() {
        try {
          if (this.$isAdmin()) {
            const lastestTasks = (
              await this.rootRef.child("tasks")
                .limitToLast(5)
                .once("value")
            ).val()
            for (const key in lastestTasks) {
              const Task = lastestTasks[key]
              Task.key = key
              Task.createdByName = await this.getUserProfileName(Task.createdBy)
              this.lastestTasks.unshift(Task)
            }
          } else {
            for (const ClientKey in this.clients) {
              const LastTask = Object.entries((
                await this.rootRef.child(`tasks`)
                  .orderByChild("clientKey")
                  .equalTo(ClientKey)
                  .limitToLast(1)
                  .once("value")
              ).val()).pop()
              const Task = LastTask[1]
              Task.key = LastTask[0]
              Task.createdByName = await this.getUserProfileName(Task.createdBy)
              this.lastestTasks.unshift(Task)
            }
          }
        } catch (ex) {
          console.error(ex)
        }
      },
      async getTotalAmount() {
        let totalAmount = 0
        for (const ClientKey in this.clients) {
          const ClientTransactions = (
            await this.rootRef.child(`/transactions/${ ClientKey }`)
              .once("value")
          ).val()
          if (ClientTransactions) {
            for (const key in ClientTransactions) {
              const { amount } = ClientTransactions[key]
              if (amount) {
                totalAmount += amount
              }
            }
          }
        }
        this.totalAmount = totalAmount
      },
      async getUsersCount() {
        try {
          this.usersCount = (
            await this.rootRef.child("users")
              .once("value")
          ).numChildren()
        } catch (ex) {
          console.error(ex)
        }
      },
      showAddHoursModal() {
        $("#AddHoursModal").modal("show")
      },
      showNewClientModal() {
        $("#NewClientModal").modal("show")
      }
    },
    async created() {
      await this.getProjectsByAuthUser()
      this.getClientStats()
      this.getLastestTasks()
      this.getLastestStories()
      this.getUsersCount()
      this.getTotalAmount()
    },
    mounted() {
      feather.replace()
    }
  }
</script>