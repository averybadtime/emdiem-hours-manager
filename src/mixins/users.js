export const UsersMixin = {
  methods: {
    async getUserProfile(uid) {
      try {
        return (
          await this.rootRef.child(`/profiles/${ uid }`)
            .once("value")
        ).val()
      } catch (ex) {
        throw ex
      }
    },
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