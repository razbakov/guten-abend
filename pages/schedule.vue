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
        <div v-else class="p-4 card-item">
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
          <div v-if="!item.link && isAdmin" class="text-red-500 font-bold">
            No link
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

          <TFeedback
            v-if="item.finished && item.awaitsFeedback"
            :id="item.id"
          />
          <TRsvp
            v-if="!item.finished || !item.awaitsFeedback"
            :id="item.id"
            v-slot="{ count }"
            :collection="collection"
            :can-answer="!item.finished"
            class="my-4"
          >
            <div v-if="item.finished">{{ count }} participated</div>
            <div v-else>{{ count }} participants. Do you want to join?</div>
          </TRsvp>
          <div
            v-if="item.going && !item.finished"
            class="md:flex p-4 -m-4 mt-4 bg-gray-200 text-gray-700 text-center"
          >
            <template v-if="item.opened">
              <a
                v-if="item.link"
                class="btn block w-full cursor-pointer"
                @click="openLink(item.id, 'zoom', item.link)"
                >Open in Zoom</a
              >
              <a
                v-if="item.attachment"
                class="btn-secondary block w-full md:ml-2 mt-2 md:mt-0 cursor-pointer"
                @click="openLink(item.id, 'attachment', item.attachment)"
                >Open Attachment</a
              >
            </template>
            <div v-else class="md:flex w-full items-center">
              <div class="flex-grow text-left">
                Zoom link will appear here before the event.
              </div>
              <TButton
                type="secondary"
                @click="openLink(item.id, 'calendar', item.calendarLink)"
                >Add to calendar</TButton
              >
            </div>
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
import googleCalendarEventUrl from 'generate-google-calendar-url'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import TButton from '~/components/TButton'
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TFeedback from '~/components/TFeedback'
import TRsvp from '~/components/TRsvp'
import TGuests from '~/components/TGuests'
import Notification from '~/components/icons/Notification'
import { getDay, getTime, getDate, openURL } from '~/utils'

export default {
  components: {
    TButton,
    TCardList,
    TRsvp,
    TPreview,
    TGuests,
    TFeedback,
    Notification
  },
  data: () => ({
    notificationId: false
  }),
  setup() {
    const title = 'Schedule'
    const collection = 'meetups'
    const add = 'Add event'

    const { can, isAdmin } = useAuth()
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

      const calendarLink = googleCalendarEventUrl({
        start: new Date(startTime),
        end: new Date(endTime),
        title: item.title,
        details: 'https://gutenabend.netlify.app/schedule/',
        location: 'Zoom'
      })

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
        openTime,
        calendarLink
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
      updateRsvp,
      isAdmin
    }
  },
  methods: {
    async openLink(eventId, type, link) {
      await this.updateRsvp(eventId, 'meetups', 'yes', {
        [`${type}At`]: +new Date(),
        [type]: true
      })

      this.openURL(link)
    }
  }
}
</script>
