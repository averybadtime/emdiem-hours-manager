export const ClientsMixin = {
  methods: {
    async getClientByKey(ClientKey) {
      try {
        return (
          await this.rootRef.child(`/clients/${ ClientKey }`)
            .once("value")
        ).val()
      } catch (ex) {
        throw ex
      }
    },
    async getProjectsByAuthUser() {
      try {
        let Projects
        if (this.$isAdmin()) {
          const AllProjects = (await this.rootRef.child("clients").once("value")).val()
          const ProjectKeys = {}
          for (const key in AllProjects) {
            ProjectKeys[key] = true
          }
          Projects = ProjectKeys
        } else {
          Projects = (await this.rootRef.child(`projects-by-user/${ this.$store.state.user.uid }`).once("value")).val()
        }
        this.clients = Projects
      } catch(ex) {
        console.error(ex)
      }
    }
  }
}