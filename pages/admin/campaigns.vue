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
        </div>
      </template>
    </TCardList>
    <!-- <codemirror v-model="data" :options="cmOptions" /> -->
  </main>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/base16-light.css'
import TCardList from '~/components/TCardList'
import { getDate, getTime } from '~/utils'

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
        type: 'datetime-local'
      },
      {
        name: 'content',
        hideLabel: true,
        component: codemirror,
        options: {
          mode: 'markdown',
          theme: 'base16-light',
          tabSize: 2,
          styleActiveLine: true,
          lineWrapping: true
        }
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
