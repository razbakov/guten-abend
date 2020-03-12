import { reactive, toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default (autoSignin) => {
  const firestore = firebase.firestore()

  const state = reactive({
    loading: true,
    uid: null,
    profile: null
  })

  const auth = firebase.auth()

  auth.onAuthStateChanged((user) => {
    state.loading = false
    state.uid = user?.uid
    loadProfile()
  })

  if (autoSignin) {
    auth.signInAnonymously()
  }

  async function loadProfile() {
    if (!state.uid) {
      return
    }

    state.loading = true

    const doc = await firestore
      .collection('profiles')
      .doc(state.uid)
      .get()

    state.loading = false

    if (!doc.exists) {
      return
    }

    state.profile = doc.data()
  }

  async function saveProfileName(name) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const profile = {
      createdBy: state.uid,
      createdAt: +new Date(),
      name
    }

    await firestore
      .collection('profiles')
      .doc(state.uid)
      .set(profile)

    loadProfile()
  }

  return {
    ...toRefs(state),
    auth,
    saveProfileName,
    loadProfile
  }
}
