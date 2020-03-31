import Vue from 'vue'
import { reactive } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default () => {
  const { uid } = useAuth()

  const firestore = firebase.firestore()

  const state = reactive({
    participants: []
  })

  const collection = firestore.collection('participants')

  collection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = {
        ...change.doc.data(),
        id: change.doc.id
      }

      if (change.type === 'added') {
        state.participants.push(data)
      }

      if (change.type === 'modified') {
        const indexOf = state.participants
          .map((item) => item.id)
          .indexOf(change.doc.id)

        Vue.set(state.participants, indexOf, data)
      }
    })
  })

  const getRsvp = (eventId) =>
    state.participants.find(
      (item) => item.event?.id === eventId && item.uid === uid.value
    )

  const getRsvpResponse = (eventId) => getRsvp(eventId)?.rsvp ?? null

  const getCount = (eventId) =>
    state.participants.filter(
      (item) => item.event?.id === eventId && item.rsvp === 'yes'
    ).length

  async function updateRsvp(event, rsvp) {
    const rsvpObject = getRsvp(event.id)

    if (rsvpObject) {
      await collection.doc(rsvpObject.id).update({
        updateAt: +new Date(),
        rsvp
      })
    } else {
      await collection.add({
        uid: uid.value,
        event,
        createdAt: +new Date(),
        updateAt: +new Date()
      })
    }
  }

  return {
    getRsvp,
    getRsvpResponse,
    updateRsvp,
    getCount
  }
}
