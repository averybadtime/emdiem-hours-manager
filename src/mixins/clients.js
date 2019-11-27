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
    }
  }
}