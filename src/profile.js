import { DATABASE } from "@/firebase"

async function getByUID(uid) {
  try {
    const profile = (
      await DATABASE.ref(`/profiles/${uid}`)
        .once("value")
    ).val()
    return profile
  } catch (ex) {
    console.error(ex)
    return null
  }
}

export default {
  getByUID
}