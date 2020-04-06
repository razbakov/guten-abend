<template>
  <main>
    <div v-if="page" class="typo p-4 md:p-0">
      <h1>{{ page.title }}</h1>
      <TPreview :content="page.content" />
    </div>
  </main>
</template>

<script>
import useDoc from '~/use/doc'
import TPreview from '~/components/TPreview'

export default {
  components: {
    TPreview
  },
  async mounted() {
    await this.load(this.$route.params.id)
  },
  setup() {
    const { load, doc: page } = useDoc('events')

    return {
      page,
      load
    }
  }
}
</script>
