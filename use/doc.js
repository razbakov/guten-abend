import { reactive, toRefs, computed } from '@vue/composition-api'
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

    if (!data.id) {
      const result = await create(data)
      return result
    }

    const changes = {
      updatedAt: +new Date(),
      updatedBy: uid.value,
      ...data
    }

    const result = await collection.doc(data.id).update(changes)
    return result
  }

  async function updateById(id, data) {
    const result = await collection.doc(id).update(data)
    return result
  }

  async function setById(id, data) {
    const result = await collection.doc(id).set(data)
    return result
  }

  async function remove(id) {
    await collection.doc(id).delete()
  }

  async function create(data) {
    const doc = await collection.add({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      updatedBy: uid.value,
      ...data
    })

    state.loading = false

    return doc
  }

  const isCreator = computed(
    () => state.doc && uid.value === state.doc.createdBy
  )

  return {
    ...toRefs(state),
    create,
    load,
    update,
    loadById,
    remove,
    updateById,
    isCreator,
    setById
  }
}
