<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot="{ item }">
        <div class="p-4 card-item">
          <div class="font-bold text-xl">
            {{ item.title }}
          </div>
          <div class="mb-2 text-gray-500 font-bold">{{ item.status }}</div>
          <div class="mb-2 text-gray-500">Subject: {{ item.subject }}</div>
          <div class="mb-2 text-gray-500">
            Scheduled for {{ getDate(item.scheduledAt) }} at
            {{ getTime(item.scheduledAt) }}
          </div>
          <div v-if="item.recipients" class="mb-2 text-gray-500">
            {{ Object.keys(item.recipients).length }} recipients
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import TCardList from '~/components/TCardList'
import TAccountSelector from '~/components/TAccountSelector'
import { getDate, getTime, getDateObect, toDatetimeLocal } from '~/utils'

export default {
  components: {
    TCardList
  },
  data: () => ({
    data: ''
  }),
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
        name: 'status',
        type: 'select',
        options: ['draft', 'scheduled', 'sent', 'canceled']
      },
      {
        name: 'scheduledAt',
        type: 'datetime-local',
        set: (val) => {
          if (!val) return ''
          return new Date(val)
        },
        get: (val) => {
          if (!val) return ''
          return toDatetimeLocal(getDateObect(val))
        }
      },
      {
        name: 'recipients',
        component: TAccountSelector
      },
      {
        name: 'content',
        hideLabel: true,
        type: 'markdown'
      }
    ]

    return {
      fields,
      title,
      collection,
      add,
      getDate,
      getTime
    }
  }
}
</script>
