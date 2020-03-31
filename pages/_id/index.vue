<template>
  <main class="typo container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
    <div v-if="event">
      <h1>{{ event.title }}</h1>
      <Preview :content="event.content" />
    </div>

    <div
      v-if="editing"
      class="absolute mt-24 top-0 left-0 bottom-0 bg-gray-200 border rounded mr-2 p-1"
    >
      <button
        class="shadow bg-blue-500 mb-2 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        @click="update(event)"
      >
        Save
      </button>
      <div class="bg-white">
        <input
          v-model="event.title"
          type="text"
          class="bg-white border-b p-2 w-full"
        />
        <textarea
          v-model="event.content"
          class="font-mono p-2 w-full h-full"
          rows="20"
        />
      </div>
    </div>
  </main>
</template>

<script>
import useCollection from '~/use/collection.js'
import Preview from '~/components/Preview.vue'

export default {
  components: {
    Preview
  },
  async asyncData({ params }) {
    if (!process.server) {
      return {}
    }

    const { load, doc: event } = useCollection('events')

    await load(params.id)

    return {
      loading: false,
      event
    }
  },
  computed: {
    editing() {
      return !!this.$route.query.edit
    }
  },
  async mounted() {
    await this.load(this.$route.params.id)
  },
  setup() {
    const { load, update, doc: event } = useCollection('events')

    return {
      event,
      update,
      load
    }
  }
}
</script>
