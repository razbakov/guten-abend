<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :map="map"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:card-toolbar="{ item }">
        <button
          v-if="can('notify', collection, item)"
          class="p-2 hover:text-primary"
          @click="
            notificationId !== item.id
              ? (notificationId = item.id)
              : (notificationId = false)
          "
        >
          <Notification
            :class="notificationId === item.id ? 'text-primary' : ''"
          />
        </button>
      </template>
      <template v-slot:default="{ item }">
        <div v-if="notificationId === item.id" class="p-4 card-item">
          <TCardList
            v-slot="{ item: notification }"
            collection="campaigns"
            title="Notifications"
            add="Add notification"
            :fields="getNotificationFields(item)"
            :filters="[
              {
                default: true,
                name: 'all',
                filter: (notification) => notification.eventId === item.id
              }
            ]"
          >
            <div class="font-bold">{{ notification.type }}</div>
            <TPreview class="border px-4" :content="notification.content" />
          </TCardList>
        </div>
        <div v-else class="p-2">
          <div class="text-gray-700 text-base mb-2">
            <strong class="font-bold">{{ getDay(item.date) }}</strong>
            {{ getDate(item.date) }} • {{ getTime(item.date) }}
            <span v-if="item.duration">• {{ item.duration }} min</span>
          </div>
          <div class="p-4 card-item">
            <div class="font-bold text-xl mb-2">
              {{ item.title }}
            </div>
            <div v-if="item.happening" class="text-green-500 font-bold">
              Happening now
            </div>
            <div v-if="item.soon" class="text-orange-500 font-bold">
              Starts soon
            </div>
            <div>
              <button
                class="underline hover:no-underline"
                @click="
                  openedId === item.id
                    ? (openedId = false)
                    : (openedId = item.id)
                "
              >
                {{ openedId === item.id ? 'Read less' : 'Read more' }}
              </button>
            </div>

            <TPreview
              v-if="openedId === item.id"
              class="m-2"
              :content="item.description"
            />
          </div>
        </div>
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
import Notification from '~/components/icons/Notification'
import { getDay, getTime, getDate, openURL } from '~/utils'

export default {
  components: {
    TCardList,
    TPreview,
    Notification
  },
  data: () => ({
    notificationId: false,
    openedId: false
  }),
  setup() {
    const title = 'Schedule'
    const collection = 'meetups'
    const add = 'Add event'

    const { can } = useAuth()
    const { getRsvpResponse, getFeedback, updateRsvp } = useRSVP()
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
        label: 'Duration (min)',
        default: '30'
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
        default: 'yes'
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

    const getNotificationFields = (event) => {
      return [
        {
          name: 'notification',
          type: 'select',
          options: ['before10min', 'before1h', 'after']
        },
        {
          name: 'content',
          type: 'markdown',
          hideLabel: true
        },
        {
          name: 'eventId',
          default: event.id,
          type: 'hidden'
        },
        {
          name: 'type',
          default: 'notification',
          type: 'hidden'
        },
        {
          name: 'status',
          default: 'scheduled',
          type: 'hidden'
        },
        {
          name: 'scheduledAt',
          default: '',
          type: 'hidden'
        },
        {
          name: 'collection',
          default: 'meetups',
          type: 'hidden'
        },
        {
          name: 'from',
          default: 'Aleksey from Guten Abend <gutenabend@razbakov.com>',
          type: 'hidden'
        },
        {
          name: 'subject',
          default: event.title,
          type: 'hidden'
        },
        {
          name: 'title',
          default: `Notification for ${event.title}`,
          type: 'hidden'
        }
      ]
    }

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
      now,
      getNotificationFields,
      openURL,
      updateRsvp
    }
  },
  methods: {
    async openLink(eventId, link) {
      await this.updateRsvp(eventId, 'meetups', 'yes', {
        joinedAt: +new Date(),
        confirmed: true
      })

      this.openURL(link)
    }
  }
}
</script>
