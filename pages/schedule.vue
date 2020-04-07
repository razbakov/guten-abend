<template>
  <main class="p-4">
    <TCardList
      v-slot="{ item }"
      :collection="collection"
      :title="title"
      :add="add"
      :map="map"
      :fields="fields"
      :filters="filters"
    >
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
        <div v-if="item.happening" class="text-green-500 font-bold">
          Happening now
        </div>
        <div v-if="item.soon" class="text-orange-500 font-bold">
          Starts soon
        </div>
        <TPreview
          v-if="!item.finished || !item.awaitsFeedback"
          class="mb-2"
          :content="item.description"
        />
        <button
          v-if="can('manage', collection, item)"
          class="underline mt-2"
          @click="
            openedListId !== item.id
              ? (openedListId = item.id)
              : (openedListId = false)
          "
        >
          Guests
        </button>
        <TGuests v-if="openedListId === item.id" :id="item.id" class="p-4" />
      </div>
      <TFeedback v-if="item.finished && item.awaitsFeedback" :id="item.id" />
      <TRsvp
        v-if="!item.finished || !item.awaitsFeedback"
        :id="item.id"
        v-slot="{ count }"
        :collection="collection"
        :can-answer="!item.finished"
      >
        <div v-if="item.finished">{{ count }} participated</div>
        <div v-else>{{ count }} participants. Do you want to join?</div>
      </TRsvp>
      <div
        v-if="item.going && !item.finished"
        class="md:flex px-6 py-4 bg-gray-200 text-gray-700 text-center"
      >
        <template v-if="item.opened">
          <a
            v-if="item.link"
            class="btn block w-full"
            target="_blank"
            rel="noopener"
            :href="item.link"
            >Open in Zoom</a
          >
          <a
            v-if="item.attachment"
            class="btn-secondary block w-full md:ml-2 mt-2 md:mt-0"
            target="_blank"
            rel="noopener"
            :href="item.attachment"
            >Open Attachment</a
          >
        </template>
        <div v-else>
          Zoom link will appear here before the event. Check later.
        </div>
      </div>
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
import TFeedback from '~/components/TFeedback'
import TRsvp from '~/components/TRsvp'
import TGuests from '~/components/TGuests'
import { getDay, getTime, getDate } from '~/utils'

export default {
  components: {
    TCardList,
    TRsvp,
    TPreview,
    TGuests,
    TFeedback
  },
  setup() {
    const title = 'Schedule'
    const collection = 'meetups'
    const add = 'Add event'

    const { can } = useAuth()
    const { getRsvpResponse, getFeedback } = useRSVP()
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
      },
      {
        name: 'enableFeedback',
        type: 'select',
        options: ['yes', 'no'],
        default: 'no'
      }
    ]

    const map = (item) => {
      const minute = 60000
      const duration = item.duration ? parseInt(item.duration, 10) : 120

      const startTime = +new Date(item.date)
      const endTime = startTime + minute * duration
      const openTime = startTime - minute * 60

      const going = getRsvpResponse(item.id) === 'yes'
      const skip = getRsvpResponse(item.id) === 'no'
      const inbox = !getRsvpResponse(item.id)

      const finished = now > endTime
      const started = now > startTime
      const opened = now > openTime && !finished

      const happening = started && !finished
      const soon = !started && opened

      const awaitsFeedback =
        going && item.enableFeedback === 'yes' && !getFeedback(item.id)

      const upcoming = !skip && (!finished || awaitsFeedback)

      return {
        ...item,
        happening,
        finished,
        started,
        soon,
        opened,
        awaitsFeedback,
        going,
        skip,
        inbox,
        upcoming,
        startTime,
        endTime,
        openTime
      }
    }

    const filters = [
      {
        name: 'upcoming',
        label: 'Upcoming',
        default: true,
        filter: (item) => item.upcoming,
        sort: 'date'
      },
      {
        name: 'past',
        label: 'Past',
        filter: (item) => !item.upcoming,
        sort: '-date'
      },
      {
        name: 'archive',
        label: 'Archive',
        filter: (item) => item.skip,
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
      map,
      openedListId,
      now
    }
  }
}
</script>
