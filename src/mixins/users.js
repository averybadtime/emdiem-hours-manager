export const UsersMixin = {
  methods: {
    async getUserProfileName(uid) {
      try {
        return (
          await this.rootRef.child(`/profiles/${ uid }/name`)
            .once("value")
        ).val()
      } catch (ex) {
        throw ex
      }
    }
  }
}