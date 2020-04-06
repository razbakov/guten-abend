<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:card-toolbar="{ item }">
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
          <div class="font-bold text-xl mb-2">
            {{ item.title }}
          </div>
          <div class="text-gray-700 text-base">
            <strong class="font-bold">{{ getDay(item.date) }}</strong>
            {{ getDate(item.date) }} at {{ getTime(item.date) }}
            <a
              href="https://time.is/CEST"
              title="Central European Summer Time"
              target="_blank"
              rel="noopened"
              class="underline"
              >CEST</a
            >
            <span v-if="item.duration">({{ item.duration }} min)</span>
          </div>
          <div v-if="item.now" class="text-green-500 font-bold">
            Happening now
          </div>
          <div v-if="item.soon" class="text-orange-500 font-bold">
            Starts soon
          </div>
          <TGuests v-if="openedListId === item.id" :id="item.id" class="p-4" />
          <TPreview v-else class="mb-2" :content="item.description" />
        </div>
        <TRsvp :id="item.id" :collection="collection">
          <template v-slot:header="{ count }">
            <div v-if="item.past">{{ count }} participated</div>
            <div v-else>{{ count }} participants. Do you want to join?</div>
          </template>
          <template v-slot:default>
            <div
              v-if="!item.past"
              class="flex px-6 py-4 bg-gray-200 text-gray-700"
            >
              <template v-if="item.soon || item.now">
                <div v-if="item.link">
                  <a
                    class="btn"
                    target="_blank"
                    rel="noopener"
                    :href="item.link"
                    >Open in Zoom</a
                  >
                </div>
                <div v-if="item.attachment">
                  <a
                    class="btn-secondary ml-2"
                    target="_blank"
                    rel="noopener"
                    :href="item.attachment"
                    >Open Attachment</a
                  >
                </div>
              </template>
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
        name: 'duration',
        label: 'Duration (min)'
      },
      {
        name: 'link',
        label: 'Meeting Link'
      },
      {
        name: 'attachment',
        label: 'Attachment'
      }
    ]

    const filters = [
      {
        name: 'upcoming',
        label: 'Upcoming',
        default: true,
        map: (item) => ({
          ...item,
          past: false,
          now:
            +new Date(item.date) + 60000 * item.duration > now &&
            +new Date(item.date) < now,
          soon:
            +new Date(item.date) > now &&
            +new Date(item.date) - 60000 * 60 < now
        }),
        filter: (item) =>
          +new Date(item.date) + 60000 * item.duration > now &&
          getRsvpResponse(item.id) !== 'no',
        sort: 'date'
      },
      {
        name: 'past',
        label: 'Past',
        map: (item) => ({
          ...item,
          past: true
        }),
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
