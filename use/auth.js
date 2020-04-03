import Vue from 'vue'
import { toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

let uid = null
let isAdmin = false
let account = null

if (window) {
  isAdmin = !!window.localStorage.getItem('is_admin')
  uid = window.localStorage.getItem('uid')
  account = JSON.parse(window.localStorage.getItem('account'))
}

const state = Vue.observable({
  loading: true,
  signingIn: false,
  uid,
  profile: null,
  account,
  initialized: false
})

export default () => {
  if (!state.initialized) {
    firebase.auth().onAuthStateChanged(setUser)

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      signInWithEmailLink(window.location.href)
    }

    state.initialized = true
  }

  const ready = computed(() => !state.loading && !!state.uid && !!state.account)

  function can(action, object) {
    if (action === 'edit') {
      return isAdmin || !object || object.createdBy === state.uid
    } else {
      return true
    }
  }

  async function setUser(user) {
    if (user) {
      state.uid = user.uid
    } else {
      state.uid = null
    }

    if (!state.uid) {
      state.account = null
      state.profile = null
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('account')
      return
    }

    window.localStorage.setItem('uid', state.uid)

    const firestore = firebase.firestore()

    const account = await loadAccount()

    if (!account) {
      const newAccount = {
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
        .set(newAccount)

      await loadAccount()
    }

    await loadProfile()
  }

  async function loadAccount() {
    state.loading = true

    const firestore = firebase.firestore()

    const doc = await firestore
      .collection('accounts')
      .doc(state.uid)
      .get()

    if (!doc.exists) {
      return false
    }

    state.account = doc.data()
    window.localStorage.setItem('account', JSON.stringify(state.account))
    state.loading = false

    return true
  }

  async function loadProfile() {
    if (!state.uid) {
      state.profile = null
      return
    }

    state.loading = true

    const firestore = firebase.firestore()

    const doc = await firestore
      .collection('profiles')
      .doc(state.uid)
      .get()

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

    state.loading = false
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

    const firestore = firebase.firestore()

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

    const firestore = firebase.firestore()

    await firestore
      .collection('accounts')
      .doc(state.uid)
      .update(changes)

    loadAccount()
  }

  async function signOut() {
    state.loading = true

    await firebase.auth().signOut()
    setUser(null)

    state.loading = false
  }

  async function signInAnonymously() {
    await firebase.auth().signInAnonymously()
  }

  async function signInWithEmailLink(link) {
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
    await firebase.auth().signInWithEmailLink(email, link)

    state.signingIn = false

    // Clear email from storage.
    window.localStorage.removeItem('emailForSignIn')

    // You can access the new user via result.user
    // Additional user info profile not available via:
    // result.additionalUserInfo.profile == null
    // You can check if the user is new or existing:
    // result.additionalUserInfo.isNewUser
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
    state.signingIn = true

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    firebase.auth().signInWithRedirect(provider)
  }

  return {
    ...toRefs(state),
    updateProfile,
    updateAccount,
    setUser,
    signInWithGoogle,
    sendSignInLinkToEmail,
    signOut,
    ready,
    isAdmin,
    can,
    signInAnonymously,
    signInWithEmailLink
  }
}
