import { reactive, toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default () => {
  const { uid } = useAuth()

  const firestore = firebase.firestore()

  const state = reactive({
    loading: true,
    event: null,
    messages: []
  })

  const eventsCollection = firestore.collection('events')

  let eventDoc = null

  async function load(eventId) {
    const filteredEvents = await eventsCollection
      .where('slug', '==', eventId)
      .get()

    if (filteredEvents.length === 0) {
      return false
    }

    eventDoc = filteredEvents[0]

    state.event = eventDoc.data()

    state.loading = false

    return true
  }

  async function create(data) {
    const event = await eventsCollection.add({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      data
    })

    state.loading = false

    return event
  }

  return {
    ...toRefs(state),
    create,
    load
  }
}
