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
        @keyup.enter="changeTopic(newTopic)"
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
          @keyup.enter="
            sendMessage(input)
            input = ''
          "
        />
      </div>
      <div v-else>
        <input
          v-model="name"
          type="text"
          class="border w-full rounded p-4"
          placeholder="Your name"
          @keyup.enter="saveProfileName(name)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth.js'
import useUtils from '~/use/utils.js'
import useThreads from '~/use/threads.js'

export default {
  data: () => ({
    input: '',
    newTopic: '',
    editing: true,
    name: ''
  }),
  async validate({ app, params }) {
    const { load } = useThreads()
    const exists = await load(params.id)

    return exists
  },
  setup() {
    const { uid, loading, profile, saveProfileName } = useAuth(true)
    const { formatDate } = useUtils()
    const { thread, messages, load, sendMessage, changeTopic } = useThreads()

    return {
      uid,
      profile,
      saveProfileName,
      formatDate,
      thread,
      sendMessage,
      changeTopic,
      load,
      loading,
      messages
    }
  },
  watch: {
    'thread.topic': {
      handler(val) {
        this.newTopic = val
        this.editing = !this.newTopic
      }
    }
  },
  mounted() {
    this.load(this.$route.params.id)
  }
}
</script>
