import Vue from 'vue'
import { reactive } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default () => {
  const { uid, account } = useAuth()

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
      (item) => item.eventId === eventId && item.uid === uid.value
    )

  const getRsvpResponse = (eventId) => getRsvp(eventId)?.rsvp ?? null

  const getList = (eventId) =>
    state.participants
      .filter((item) => item.eventId === eventId && item.rsvp === 'yes')
      .map((item) => item.participant)

  const getCount = (eventId) => getList(eventId).length

  async function updateRsvp(event, rsvp) {
    const rsvpObject = getRsvp(event.id)

    if (rsvpObject) {
      await collection.doc(rsvpObject.id).update({
        updateAt: +new Date(),
        participant: account.value,
        rsvp
      })
    } else {
      await collection.add({
        uid: uid.value,
        participant: account.value,
        eventId: event.id,
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
    getCount,
    getList
  }
}
