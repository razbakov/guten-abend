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
          <div class="mb-2 text-gray-500">/{{ item.slug }}</div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/base16-light.css'
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
      add
    }
  }
}
</script>
