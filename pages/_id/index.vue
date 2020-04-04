<template>
  <main>
    <div v-if="event" class="typo">
      <h1>{{ event.title }}</h1>
      <TPreview :content="event.content" />
    </div>

    <div
      v-if="editing && event"
      class="absolute mt-24 top-0 left-0 bottom-0 bg-gray-200 border rounded mr-2 p-1"
    >
      <button class="btn mb-2" @click="update(event)">
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
import useDoc from '~/use/doc'
import TPreview from '~/components/TPreview'

export default {
  components: {
    TPreview
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
    const { load, update, doc: event } = useDoc('events')

    return {
      event,
      update,
      load
    }
  }
}
</script>
