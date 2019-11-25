<template>
  <div class="page-content">
    <AddHoursModal/>
    <NewClientModal/>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-3 mb-md-0">Dashboard</h4>
      <div class="d-flex align-items-center flex-wrap text-nowrap">
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
          :stat="clients.length"
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
          :stat="clients.length"
        ></stat-card>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table">
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
    <div class="row mt-3">
      <div class="col-lg-6">
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
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Últimas tareas</h6>
            <story-list-item v-for="story in lastestStories"
              :key="story.key"
              :story="story">
            </story-list-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import { UsersMixin } from "@/mixins/users"
  import AddHoursModal from "@/components/modals/AddHoursModal"
  import NewClientModal from "@/components/modals/NewClientModal"
  import StoryListItem from "@/components/StoryListItem"
  import StatCard from "@/components/StatCard"
  import TaskListItem from "@/components/TaskListItem"
  export default {
    components: {
      AddHoursModal,
      NewClientModal,
      StoryListItem,
      StatCard,
      TaskListItem
    },
    mixins: [
      UsersMixin
    ],
    data() {
      return {
        lastestStories: [],
        lastestTasks: [],
        localClients: [],
        rootRef: DATABASE.ref(),
        totalAmount: null,
        usersCount: null
      }
    },
    computed: {
      clients() {
        return this.$store.state.clients
      }
    },
    methods: {
      async getClientStats() {
        for (const client of this.clients) {
          const stories = await this.getClientStories(client.slug)
          const tasks = await this.getClientTasks(client.slug)
          const amount = await this.getClientAmount(client.slug)
          this.localClients.push({
            amount,
            createdAt: client.createdAt,
            name: client.name,
            stories,
            tasks
          })
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
        try {
          const lastestStories = (
            await this.rootRef.child("stories")
              .limitToLast(5)
              .once("value")
          ).val()
          for (const key in lastestStories) {
            const Story = lastestStories[key].data
            Story.key = key
            Story.createdByName = await this.getUserProfileName(Story.createdBy)
            this.lastestStories.unshift(Story)
          }
        } catch (ex) {
          console.error(ex)
        }
      },
      async getLastestTasks() {
        try {
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
        } catch (ex) {
          console.error(ex)
        }
      },
      async getTotalAmount() {
        let totalAmount = 0
        for (const client of this.clients) {
          const ClientTransactions = (
            await this.rootRef.child(`/transactions/${ client.slug }`)
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
    created() {
      this.getLastestTasks()
      this.getLastestStories()
      this.getClientStats()
      this.getUsersCount()
      this.getTotalAmount()
    },
    mounted() {
      feather.replace()
    }
  }
</script>