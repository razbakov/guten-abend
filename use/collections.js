import Vue from 'vue'
import { reactive, toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default (name, order) => {
  const firestore = firebase.firestore()

  const state = reactive({
    entities: {}
  })

  const collection = firestore.collection(name)

  collection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified' || change.type === 'added') {
        Vue.set(state.entities, change.doc.id, change.doc.data())
      }
      if (change.type === 'removed') {
        Vue.delete(state.entities, change.doc.id)
      }
    })
  })

  const sortBy = (key) => {
    return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0)
  }

  const docs = computed(() => {
    let result = Object.keys(state.entities).map((key) => ({
      ...state.entities[key],
      id: key
    }))

    if (order) {
      result = result.sort(sortBy(order))
    }

    return result
  })

  return {
    ...toRefs(state),
    docs
  }
}
