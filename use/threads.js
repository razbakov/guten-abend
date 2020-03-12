import { reactive, toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default () => {
  const { uid, profile } = useAuth(true)

  const firestore = firebase.firestore()

  const state = reactive({
    loading: true,
    thread: null,
    messages: []
  })

  const threadsCollection = firestore.collection('threads')
  let messagesCollection = null
  let threadDoc = null

  async function load(threadId) {
    messagesCollection = firestore.collection(`threads/${threadId}/messages`)
    threadDoc = firestore.collection('threads').doc(threadId)

    const doc = await threadDoc.get()

    if (!doc.exists) {
      return false
    }

    state.thread = doc.data()

    firestore
      .collection('threads')
      .doc(threadId)
      .onSnapshot((doc) => {
        state.thread = doc.data()
      })

    messagesCollection.orderBy('createdAt', 'asc').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          state.messages.push({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
        if (change.type === 'modified') {
        }
        if (change.type === 'removed') {
        }
      })
    })

    state.loading = false

    return true
  }

  function sendMessage(message) {
    if (!messagesCollection) {
      return
    }

    messagesCollection.add({
      authorId: uid.value,
      authorName: profile.value.name,
      createdAt: +new Date(),
      type: 'message',
      message
    })
  }

  function changeTopic(newTopic) {
    threadDoc.update({
      topic: newTopic
    })
  }

  async function create() {
    const thread = await threadsCollection.add({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value
    })

    state.loading = false

    this.$router.push(`/${thread.id}`)
  }

  return {
    ...toRefs(state),
    create,
    sendMessage,
    changeTopic,
    load
  }
}
