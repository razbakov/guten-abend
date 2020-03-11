<template>
  <div v-if="loading">Loading</div>
  <div v-else class="m-4 pt-24 bg-white">
    <div
      v-if="thread"
      class="fixed bg-white top-0 left-0 right-0 p-4 border-t shadow-md"
    >
      <h1 v-if="!editing" class="font-bold" @click="editing = true">
        {{ thread.topic }}
      </h1>
      <input
        v-else
        v-model="newTopic"
        type="text"
        class="border w-full rounded p-4"
        placeholder="Set a thread topic"
        @keyup.enter="changeTopic()"
      />
    </div>
    <div class="h-screen overflow-y-auto">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div class="flex justify-between">
          <div class="font-bold">{{ message.authorName }}</div>
          <div class="font-bold">{{ formatDate(message.createdAt) }}</div>
        </div>

        <div>{{ message.message }}</div>
      </div>
    </div>
    <div class="fixed bg-white bottom-0 left-0 right-0 p-4 border-t shadow-md">
      <div v-if="profile">
        <input
          v-model="input"
          type="text"
          class="border w-full rounded p-4"
          placeholder="Write a message"
          @keyup.enter="send()"
        />
      </div>
      <div v-else>
        <input
          v-model="name"
          type="text"
          class="border w-full rounded p-4"
          placeholder="Your name"
          @keyup.enter="register()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data: () => ({
    loading: true,
    thread: null,
    threadId: null,
    messages: [],
    input: '',
    newTopic: '',
    editing: true,
    name: ''
  }),
  async validate({ app, params }) {
    const threadId = params.id

    const threadDoc = await app.$fireStore
      .collection('threads')
      .doc(threadId)
      .get()

    return threadDoc.exists
  },
  computed: {
    uid() {
      return this.$store.state.auth.uid
    },

    profile() {
      return this.$store.state.auth.profile
    }
  },
  async mounted() {
    if (!this.uid) {
      await this.$fireAuth.signInAnonymously()
    }

    this.threadId = this.$route.params.id

    this.$fireStore
      .collection('threads')
      .doc(this.threadId)
      .onSnapshot((doc) => {
        this.thread = doc.data()
        this.newTopic = this.thread.topic
        this.editing = !this.newTopic
      })

    this.$fireStore
      .collection(`threads/${this.threadId}/messages`)
      .orderBy('createdAt', 'asc')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.messages.push({
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

    this.loading = false
  },
  methods: {
    formatDate(val) {
      return format(new Date(val), 'H:mm')
    },
    async register() {
      const profile = {
        createdBy: this.uid,
        createdAt: +new Date(),
        name: this.name
      }
      await this.$store.dispatch('auth/saveProfile', profile)
    },
    send() {
      this.$fireStore.collection(`threads/${this.threadId}/messages`).add({
        authorId: this.uid,
        authorName: this.profile.name,
        createdAt: +new Date(),
        type: 'message',
        message: this.input
      })

      this.input = ''
    },
    changeTopic() {
      this.$fireStore
        .collection('threads')
        .doc(this.threadId)
        .update({
          topic: this.newTopic
        })
    }
  }
}
</script>
