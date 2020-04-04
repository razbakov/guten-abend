import Vue from 'vue'
import { toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'

const state = Vue.observable({})

export default (name, order) => {
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

  const sortBy = (key) => {
    return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0)
  }

  const docs = computed(() => {
    if (!state[name]) {
      return []
    }

    let result = Object.keys(state[name]).map((key) => ({
      ...state[name][key],
      id: key
    }))

    if (order) {
      result = result.sort(sortBy(order))
    }

    return result
  })

  return {
    ...toRefs(state[name]),
    docs,
    sortBy
  }
}
