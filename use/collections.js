import Vue from 'vue'
import { reactive, toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default (name, order) => {
  const firestore = firebase.firestore()

  const state = reactive({
    docs: []
  })

  const collection = firestore.collection(name)

  let filteredCollection = collection

  if (order) {
    filteredCollection = filteredCollection.orderBy(order, 'asc')
  }

  filteredCollection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = {
        ...change.doc.data(),
        id: change.doc.id
      }

      if (change.type === 'added') {
        state.docs.push(data)
      }

      if (change.type === 'modified') {
        const indexOf = state.docs.map((item) => item.id).indexOf(change.doc.id)

        Vue.set(state.docs, indexOf, data)
      }
    })
  })

  return toRefs(state)
}
