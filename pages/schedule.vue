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
          Guests
        </button>
      </template>
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <div class="text-gray-700 text-base">
            <strong class="font-bold">{{ getDay(item.date) }}</strong>
            {{ getDate(item.date) }} at {{ getTime(item.date) }} UTC
          </div>
          <TGuests v-if="openedListId === item.id" :id="item.id" class="p-4" />
          <TPreview v-else class="mb-2" :content="item.description" />
        </div>
        <TRsvp :item="item" :collection="collection">
          <template v-slot:header="{ count }">
            {{ count }} participants. Do you want to join?
          </template>
          <template v-slot:default>
            <div class="flex px-6 py-4 bg-gray-200 text-gray-700">
              <div v-if="item.link">
                <a class="btn" target="_blank" rel="noopener" :href="item.link"
                  >Open in Zoom</a
                >
              </div>
              <div v-else>
                Zoom link will appear here before the event. Check later.
              </div>
            </div>
          </template>
        </TRsvp>
      </template>
    </TCardList>

    <div class="hero">
      <h2 class="text-2xl font-bold mb-4">Want more?</h2>
      <nuxt-link to="/ideas" class="btn-secondary">See ideas</nuxt-link>
    </div>
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
import { getDay, getTime, getDate } from '~/utils'

export default {
  components: {
    TCardList,
    TRsvp,
    TPreview,
    TGuests
  },
  setup() {
    const title = 'Schedule'
    const collection = 'meetups'
    const add = 'Add event'

    const { can } = useAuth()
    const { getRsvpResponse } = useRSVP()
    const now = +new Date()
    const openedListId = ref(false)

    const filters = [
      {
        name: 'upcoming',
        label: 'Upcoming',
        default: true,
        filter: (item) =>
          +new Date(item.date) > now && getRsvpResponse(item.id) !== 'no',
        sort: 'date'
      },
      {
        name: 'past',
        label: 'Past',
        filter: (item) =>
          +new Date(item.date) < now && getRsvpResponse(item.id) !== 'no',
        sort: '-date'
      },
      {
        name: 'archive',
        label: 'Archive',
        filter: (item) => getRsvpResponse(item.id) === 'no',
        sort: 'date'
      }
    ]

    const fields = [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Summarize event in 2-3 words'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Describe event'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'datetime-local'
      },
      {
        name: 'link',
        label: 'Zoom Link'
      }
    ]

    return {
      can,
      getDay,
      getTime,
      getDate,
      getRsvpResponse,
      filters,
      fields,
      title,
      collection,
      add,
      openedListId
    }
  }
}
</script>
