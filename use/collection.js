import Vue from 'vue'
import { toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'

const state = Vue.observable({})

export default (name) => {
  if (!state[name]) {
    const firestore = firebase.firestore()
    const collection = firestore.collection(name)

    Vue.set(state, name, {})

    collection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
          Vue.set(state[name], change.doc.id, change.doc.data())
        }
        if (change.type === 'removed') {
          Vue.delete(state[name], change.doc.id)
        }
      })
    })
  }

  const sortBy = (_key) => {
    let key = _key
    let multi = 1

    if (_key[0] === '-') {
      key = _key.slice(1)
      multi = -1
    }

    return (a, b) =>
      a[key] > b[key] ? 1 * multi : b[key] > a[key] ? -1 * multi : 0
  }

  const docs = computed(() => {
    if (!state[name]) {
      return []
    }

    return Object.keys(state[name]).map((key) => ({
      ...state[name][key],
      id: key
    }))
  })

  return {
    ...toRefs(state[name]),
    docs,
    sortBy
  }
}
