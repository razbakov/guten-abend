import { reactive, toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default (_config) => {
  const defaultConfig = {
    autoSignin: false
  }
  const config = { ...defaultConfig, ..._config }

  const firestore = firebase.firestore()

  const uid = window.localStorage.getItem('uid')
  const isAdmin = !!window.localStorage.getItem('is_admin')

  const state = reactive({
    loading: true,
    signingIn: false,
    uid,
    profile: null,
    account: null
  })

  const can = (action, object) => {
    if (action === 'edit') {
      return isAdmin || !object || object.createdBy === state.uid
    } else {
      return true
    }
  }

  // Confirm the link is a sign-in with email link.
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    state.signingIn = true

    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation')
    }
    // The client SDK will parse the code from the link for you.
    firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then(function(result) {
        state.signingIn = false
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn')
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
  }

  firebase.auth().onAuthStateChanged((user) => {
    state.loading = false
    state.uid = user?.uid

    if (state.uid) {
      window.localStorage.setItem('uid', state.uid)
    }

    loadAccount(user)
    loadProfile()
  })

  if (config.autoSignin) {
    firebase.auth().signInAnonymously()
  }

  async function signOut() {
    window.localStorage.removeItem('uid')
    await firebase.auth().signOut()

    state.uid = null
    state.profile = null
    state.account = null

    state.loading = false
  }

  const ready = computed(() => !state.loading && state.uid && state.account)

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
      const profile = {
        createdBy: state.uid,
        createdAt: +new Date()
      }

      await firestore
        .collection('profiles')
        .doc(state.uid)
        .set(profile)

      state.profile = profile
    } else {
      state.profile = doc.data()
    }
  }

  async function loadAccount(user) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const doc = await firestore
      .collection('accounts')
      .doc(state.uid)
      .get()

    state.loading = false

    if (!doc.exists) {
      const account = {
        createdBy: state.uid,
        createdAt: +new Date(),
        name: user.displayName ?? '',
        email: user.email ?? '',
        photo: user.photoURL ?? '',
        timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1]
      }

      await firestore
        .collection('accounts')
        .doc(state.uid)
        .set(account)

      state.account = account
    } else {
      state.account = doc.data()
    }
  }

  async function sendSignInLinkToEmail(email) {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    }

    await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)

    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email)
  }

  function signInWithGoogle() {
    state.loading = true

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    firebase.auth().signInWithRedirect(provider)
  }

  async function updateProfile(data) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const changes = {
      updatedAt: +new Date(),
      ...data
    }

    await firestore
      .collection('profiles')
      .doc(state.uid)
      .update(changes)

    loadProfile()
  }

  async function updateAccount(data) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const changes = {
      updatedAt: +new Date(),
      ...data
    }

    await firestore
      .collection('accounts')
      .doc(state.uid)
      .update(changes)

    loadAccount()
  }

  return {
    ...toRefs(state),
    updateProfile,
    loadProfile,
    updateAccount,
    loadAccount,
    signInWithGoogle,
    sendSignInLinkToEmail,
    signOut,
    ready,
    isAdmin,
    can
  }
}
