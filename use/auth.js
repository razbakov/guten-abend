import Vue from 'vue'
import features from 'platform-detect'
import ls from 'local-storage'
import { utm } from 'url-utm-params'
import { toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import clean from 'lodash-clean'
import useRouter from '~/use/router'

const state = Vue.observable({
  loading: true,
  signingIn: false,
  uid: null,
  profile: null,
  account: null,
  initialized: false,
  marketing: null
})

export default () => {
  const router = useRouter()

  let isAdmin = false

  if (window) {
    isAdmin = !!window.localStorage.getItem('is_admin')

    const storedUid = window.localStorage.getItem('uid')

    if (storedUid) {
      state.uid = storedUid
    }

    const storeAccount = window.localStorage.getItem('account')
    if (storeAccount) {
      state.account = JSON.parse(storeAccount)
    }

    setMarketing()
  }

  if (!state.initialized) {
    firebase.auth().onAuthStateChanged(setUser)

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      signInWithEmailLink(window.location.href)
    }

    state.initialized = true
  }

  const confirmedAccount = computed(
    () => !!state.uid && !!state.account && !!state.account.confirmed
  )

  const firestore = firebase.firestore()

  function getReferrer() {
    const payload = document.referrer

    if (!payload) {
      return ''
    }
    if (payload.includes('firebaseapp.com')) {
      return ''
    }
    if (payload.includes('localhost')) {
      return ''
    }
    if (payload.includes('gutenabend.netlify.app')) {
      return ''
    }
    if (payload.includes('gutenabend.netlify.com')) {
      return ''
    }

    return payload
  }

  function setMarketing() {
    state.marketing = ls('marketing')

    const languages = window?.navigator?.languages || []
    const languageString = languages.length
      ? languages[0]
      : window?.navigator?.userLanguage || window?.navigator?.language || ''

    const [language, locale] = languageString
      .replace('-', '_')
      .toLowerCase()
      .split('_')

    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth

    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    const marketing = {
      updatedAt: new Date(),
      timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1],
      referrer: getReferrer(),
      ref: router?.currentRoute?.query?.ref || '',
      fbclid: router?.currentRoute?.query?.fbclid || '',
      gclid: router?.currentRoute?.query?.gclid || '',
      utms: utm(document.location.href),
      language,
      locale,
      languages,
      mode: clean(features),
      screen: {
        width,
        height
      }
    }

    if (!state.marketing) {
      state.marketing = marketing
      ls('marketing', marketing)
    }

    ls('session', marketing)
  }

  function can(action, collection, object) {
    if (isAdmin) {
      return !!state.uid
    }
    if (action === 'add' && collection === 'ideas') {
      return !!state.uid
    }
    if (action === 'edit') {
      return !object || object.createdBy === state.uid
    }
    if (action === 'remove') {
      return object && object.createdBy === state.uid
    }
  }

  async function setUser(user) {
    if (user) {
      state.uid = user.uid
    } else {
      state.loading = false
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

    const account = await loadAccount()

    if (!account) {
      const newAccount = {
        createdBy: state.uid,
        createdAt: +new Date(),
        name: user.displayName ?? '',
        email: user.email ?? '',
        photo: user.photoURL ?? '',
        timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1],
        marketing: state.marketing
      }

      await firestore
        .collection('accounts')
        .doc(state.uid)
        .set(newAccount)

      await loadAccount()
    } else if (!state.account.marketing) {
      await firestore
        .collection('accounts')
        .doc(state.uid)
        .update({
          marketing: {
            ...state.marketing,
            existing: true
          }
        })
    }

    await loadProfile()
  }

  async function getAccount() {
    if (!state.account) {
      await loadAccount()
    }

    return state.account
  }

  async function loadAccount() {
    state.loading = true

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

    await loadAccount()
  }

  async function signOut() {
    state.loading = true

    await firebase.auth().signOut()
    setUser(null)

    state.loading = false

    router.replace('/')
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
    confirmedAccount,
    isAdmin,
    getAccount,
    can,
    signInAnonymously,
    signInWithEmailLink
  }
}
