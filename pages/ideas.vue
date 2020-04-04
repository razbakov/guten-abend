<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:toolbar="{ item }">
        <button
          v-if="can('manage', collection, item)"
          class="underline mr-2"
          @click="
            !openedListId ? (openedListId = item.id) : (openedListId = false)
          "
        >
          Followers
        </button>
      </template>
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <TGuests v-if="openedListId === item.id" :id="item.id" class="p-4" />
          <TPreview class="mb-2" :content="item.description" />
        </div>
        <TRsvp :id="item.id" :collection="collection">
          <template v-slot:header="{ count }">
            {{ count }} interested. Are you interested?
          </template>
        </TRsvp>
      </template>
    </TCardList>
  </main>
</template>

<script>
import { ref } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TRsvp from '~/components/TRsvp'
import TGuests from '~/components/TGuests'

export default {
  components: {
    TCardList,
    TRsvp,
    TPreview,
    TGuests
  },
  setup() {
    const title = 'Ideas'
    const collection = 'ideas'
    const add = 'Add your idea'

    const { getCount, getRsvpResponse } = useRSVP()
    const openedListId = ref(false)

    const fields = [
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

    const filters = [
      {
        name: 'active',
        label: 'Active',
        default: true,
        map: (item) => ({
          ...item,
          votes: getCount(item.id)
        }),
        filter: (item) => getRsvpResponse(item.id) !== 'no',
        sort: '-votes'
      },

      {
        name: 'archive',
        label: 'Archive',
        default: true,
        map: (item) => ({
          ...item,
          votes: getCount(item.id)
        }),
        filter: (item) => getRsvpResponse(item.id) === 'no',
        sort: '-votes'
      }
    ]

    const { can } = useAuth()

    return {
      can,
      fields,
      title,
      collection,
      add,
      filters,
      openedListId
    }
  }
}
</script>
