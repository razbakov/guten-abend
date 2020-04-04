import { reactive, toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default (name, id) => {
  const { uid } = useAuth()

  const firestore = firebase.firestore()

  const state = reactive({
    loading: true,
    exists: false,
    doc: null,
    id: null
  })

  const collection = firestore.collection(name)

  collection.doc(id).onSnapshot((doc) => {
    state.loading = false
    state.exists = doc.exists

    if (doc.exists) {
      state.doc = doc.data()
      state.id = doc.id
    } else {
      state.doc = null
      state.id = null
    }
  })

  async function update(data) {
    if (!state.exists || !state.id) {
      return
    }

    const changes = {
      updatedAt: +new Date(),
      updatedBy: uid.value,
      ...data
    }

    const result = await collection.doc(id).update(changes)

    return result
  }

  const isCreator = computed(
    () => state.doc && uid.value === state.doc.createdBy
  )

  return {
    ...toRefs(state),
    update,
    isCreator
  }
}
