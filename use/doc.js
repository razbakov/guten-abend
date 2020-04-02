import { reactive, toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default (name) => {
  const { uid } = useAuth()

  const firestore = firebase.firestore()

  const state = reactive({
    loading: true,
    exists: false,
    doc: null,
    id: null,
    slug: null
  })

  const collection = firestore.collection(name)

  async function loadById(id) {
    const doc = await collection.doc(id).get()
    state.id = id

    if (!doc.exists) {
      state.exists = false
      state.loading = false
      state.doc = {}

      return false
    }

    state.doc = doc.data()
    state.slug = state.doc.slug

    state.exists = true
    state.loading = false

    return true
  }

  async function load(slug) {
    const filteredCollection = await collection.where('slug', '==', slug).get()

    state.slug = slug

    if (filteredCollection.docs.length === 0) {
      state.exists = false
      state.loading = false
      state.doc = {}

      return false
    }

    const doc = filteredCollection.docs[0]

    state.doc = doc.data()
    state.id = doc.id

    state.exists = true
    state.loading = false

    return true
  }

  async function update(data) {
    if (data.id) {
      state.id = data.id
      state.exists = true
    }

    if (!state.id) {
      const result = await create(data)
      return result
    }

    let changes = {
      updatedAt: +new Date(),
      updatedBy: uid.value,
      ...data
    }

    if (state.exists) {
      const result = await collection.doc(state.id).update(changes)
      return result
    } else {
      changes = {
        createdAt: +new Date(),
        createdBy: uid.value,
        ...changes
      }

      const result = await collection.doc(state.id).set(changes)
      return result
    }
  }

  async function create(data) {
    const doc = await collection.add({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      updatedBy: uid.value,
      slug: state.slug,
      ...data
    })

    state.loading = false

    return doc
  }

  return {
    ...toRefs(state),
    create,
    load,
    update,
    loadById
  }
}
