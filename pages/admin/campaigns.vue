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
          <div class="mb-2 text-gray-500">{{ getDate(item.createdAt) }}</div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import TCardList from '~/components/TCardList'
import { getDate } from '~/utils'

export default {
  components: {
    TCardList
  },
  setup() {
    const title = 'Email Campaigns'
    const collection = 'campaigns'
    const add = 'New campaign'

    const fields = [
      {
        name: 'title'
      },
      {
        name: 'subject'
      },
      {
        name: 'from',
        default: 'Aleksey from Guten Abend <gutenabend@razbakov.com>'
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
      add,
      getDate
    }
  }
}
</script>
