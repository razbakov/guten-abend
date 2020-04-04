<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot:toolbar="{ item }">
        <nuxt-link
          v-if="can('manage', collection, item)"
          class="underline mr-2"
          :to="`/schedule/${item.id}`"
        >
          Followers
        </nuxt-link>
      </template>
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <TPreview class="mb-2" :content="item.description" />
        </div>
        <TRsvp :item="item" :collection="collection">
          <template v-slot:header="{ count }">
            {{ count }} interested. Are you interested?
          </template>
        </TRsvp>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TRsvp from '~/components/TRsvp'

export default {
  components: {
    TCardList,
    TRsvp,
    TPreview
  },
  data: () => ({
    title: 'Ideas',
    collection: 'ideas',
    add: 'Add your idea',
    fields: [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Summarize your idea in 2-3 words'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'Describe your idea'
      }
    ]
  }),
  setup() {
    const { can } = useAuth()

    return {
      can
    }
  }
}
</script>
