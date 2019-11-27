<template>
  <div>
    <EditActivityModal :transaction="selectedTransaction"/>
    <h6 class="card-title">Actividad</h6>
    <div v-if="transactions.length > 0">
      <transition-group name="fade">
        <ActivityListItem @show="show"
          v-for="transaction in transactions"
          :key="transaction.key"
          :transaction="transaction"/>
      </transition-group>
    </div>
    <div class="alert alert-warning d-flex" role="alert" v-else>
      No hay actividad registrada para este proyecto.
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import ActivityListItem from "@/components/ActivityListItem"
  import EditActivityModal from "@/components/modals/EditActivityModal"
  export default {
    components: {
      ActivityListItem,
      EditActivityModal
    },
    data() {
      return {
        rootRef                   : DATABASE.ref(),
        selectedTransaction       : null,
        transactions              : [],
        transactionsOnChildAdded  : null,
        transactionsOnChildChanged: null,
        transactionsOnChildRemoved: null,
        transactionsRef           : null
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug
      }
    },
    methods: {
      show(TransactionKey) {
        const index = this.transactions.findIndex(x => x.key == TransactionKey)
        if (index > -1) {
          this.selectedTransaction = this.transactions[index]
          $("#EditTransactionModal").modal("show")
        }
      },
      subscribeToTransactions() {
        this.transactionsRef =  this.rootRef.child(`/transactions/${ this.slug }`)
        this.transactionsOnChildAdded = this.transactionsRef.on("child_added", snapshot => {
          const Transaction = snapshot.val()
          Transaction.key = snapshot.key
          this.transactions.unshift(Transaction)
        })
        this.transactionsOnChildChanged = this.transactionsRef.on("child_changed", snapshot => {
          const { key } = snapshot
          const index = this.transactions.findIndex(x => x.key == key)
          if (index > -1) {
            const Transaction = snapshot.val()
            Transaction.key = key
            this.$set(this.transactions, index, Transaction)
          }
        })
        this.transactionsOnChildRemoved = this.transactionsRef.on("child_removed", snapshot => {
          const index = this.transactions.findIndex(x => x.key == snapshot.key)
          if (index > -1) {
            this.$delete(this.transactions, index)
          }
        })
      },
      unsubscribeToTransactions() {
        this.transactionsRef.off("child_added", this.transactionsOnChildAdded)
        this.transactionsRef.off("child_changed", this.transactionsOnChildChanged)
        this.transactionsRef.off("child_removed", this.transactionsOnChildRemoved)
      }
    },
    created() {
      this.subscribeToTransactions()
    },
    beforeDestroy() {
      this.unsubscribeToTransactions()
    }
  }
</script>