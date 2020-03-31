<template>
  <div class="container mx-auto w-full px-4 pb-8">
    <div v-if="loading">Loading</div>
    <div v-else>
      <div class="mb-4">
        <button
          class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          @click="update(event)"
        >
          Save
        </button>
      </div>
      <div class="flex">
        <div class="bg-white w-1/2 border rounded mr-2">
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

        <div class="w-1/2 typo">
          <h1>{{ event.title }}</h1>
          <div v-html="preview"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Markdown from '@nuxt/markdown'
import useCollection from '~/use/collection.js'

export default {
  data: () => ({
    preview: ''
  }),
  setup() {
    const { loading, load, update, doc: event } = useCollection('events')

    return {
      loading,
      event,
      load,
      update
    }
  },
  watch: {
    'event.content': {
      handler() {
        this.updatePreview()
      }
    }
  },
  mounted() {
    this.load(this.$route.params.id)
  },
  methods: {
    async updatePreview() {
      const md = new Markdown({ toc: false, sanitize: false })
      this.preview = (await md.toMarkup(this.event.content)).html
    }
  }
}
</script>
