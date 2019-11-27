<template>
  <div>
    <assign-user-modal :assigned-users="linkedUsers"/>
    <div class="card-title">Ajustes avanzados</div>
    <hr>
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="card-title mb-0">Usuarios asignados</h6>
          <button @click="showAssignUserModal"
            class="btn btn-primary btn-icon-text">
            <i class="btn-icon-prepend" data-feather="plus-circle"></i>
            Asignar nuevo usuario
          </button>
        </div>
        <div class="table-responsive"
          v-if="linkedUsers.length > 0">
          <table class="table">
            <thead>
              <th>Nombre</th>
              <th>Rol</th>
              <th>E-mail</th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="user in linkedUsers"
                :key="user.uid">
                <td>{{ user.name }}</td>
                <td>{{ user.role | role }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <button @click="unlinkUser(user.uid)"
                    class="btn btn-danger btn-xs">
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="alert alert-warning" role="alert" v-else>
          No se han asignado usuarios a este proyecto.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATABASE } from "@/firebase"
  import { UsersMixin } from "@/mixins/users"
  import AssignUserModal from "@/components/modals/AssignUserModal"
  export default {
    components: {
      AssignUserModal
    },
    mixins: [
      UsersMixin
    ],
    data() {
      return {
        linkedUsers                     : [],
        rootRef                         : DATABASE.ref(),
        usersLinksProjectsRef           : null,
        usersLinksProjectsOnChildAdded  : null,
        usersLinksProjectsOnChildRemoved: null
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug
      }
    },
    methods: {
      showAssignUserModal() {
        $("#AssignUserModal").modal("show")
      },
      async unlinkUser(uid) {
        try {
          const action = await this.$swal({
            cancelButtonText : "Cancelar",
            confirmButtonText: "Remover",
            text             : `¿Desea remover asignación del usuario a este proyecto?`,
            title            : "Confirmación",
            type             : "warning",
            showCancelButton : true
          })
          if (action.value) {
            await this.rootRef.child(`user-links-projects/${ this.slug }/${ uid }`)
              .set(null)
            this.$swal({
              text : "Usuario removido del proyecto con éxito.",
              title: "¡Hecho!",
              type : "success"
            })
          }
        } catch (ex) {
          return this.$swal({
            text : "Ocurrió un error al remover usuario del proyecto.",
            title: "Error",
            type : "error"
          })
        }
      },
      subscribeToUserLinks() {
        this.usersLinksProjectsRef = this.rootRef.child(`user-links-projects/${ this.slug }`)
        this.usersLinksProjectsOnChildAdded = this.usersLinksProjectsRef.on("child_added", snapshot => {
          const uid = snapshot.key
          this.getUserProfile(uid)
            .then(User => {
              User.uid = uid
              this.linkedUsers.push(User)
            })
            .catch(ex => {
              console.error("Fallo al cargar ", uid)  
            })
        })
        this.usersLinksProjectsOnChildRemoved = this.usersLinksProjectsRef.on("child_removed", snapshot => {
          const index = this.linkedUsers.findIndex(x => x.uid == snapshot.key)
          if (index > -1) {
            this.$delete(this.linkedUsers, index)
          }
        })
      },
      unsubscribeToUserLinks() {
        this.usersLinksProjectsRef.off("child_added", this.usersLinksProjectsOnChildAdded)
        this.usersLinksProjectsRef.off("child_removed", this.usersLinksProjectsOnChildRemoved)
      }
    },
    created() {
      this.subscribeToUserLinks()
    },
    mounted() {
      feather.replace()
    },
    beforeDestroy() {
      this.unsubscribeToUserLinks()
    }
  }
</script>