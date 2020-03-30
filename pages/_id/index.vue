<template>
  <main class="typo container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
    <div v-if="loading">Loading</div>
    <div v-else>
      <h1>{{ event.title }}</h1>
      <div v-html="preview"></div>
    </div>
  </main>
</template>

<script>
import Markdown from '@nuxt/markdown'
import useCollection from '~/use/collection.js'

export default {
  data: () => ({
    preview: ''
  }),
  setup() {
    const { loading, load, doc: event } = useCollection('events')

    return {
      loading,
      event,
      load
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
