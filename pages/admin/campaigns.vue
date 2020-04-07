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
    <!-- <codemirror v-model="data" :options="cmOptions" /> -->
  </main>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/base16-light.css'
import TCardList from '~/components/TCardList'
import { getDate } from '~/utils'

export default {
  components: {
    TCardList
    // codemirror
  },
  data: () => ({
    data: '',
    cmOptions: {
      mode: 'markdown',
      theme: 'base16-dark',
      tabSize: 2,
      styleActiveLine: true,
      lineNumbers: true
    }
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
      getDate
    }
  }
}
</script>
