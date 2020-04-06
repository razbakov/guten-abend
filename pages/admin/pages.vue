<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl">
            {{ item.title }}
          </div>
          <div class="mb-2 text-gray-500">/{{ item.slug }}</div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import TCardList from '~/components/TCardList'

export default {
  components: {
    TCardList
  },
  setup() {
    const title = 'Pages'
    const collection = 'events'
    const add = 'Add page'

    const fields = [
      {
        name: 'title'
      },
      {
        name: 'slug'
      },
      {
        name: 'content',
        type: 'textarea'
      }
    ]

    return {
      fields,
      title,
      collection,
      add
    }
  }
}
</script>
