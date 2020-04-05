<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :fields="fields"
      :filters="filters"
      :map="map"
      @loadItems="loadItems"
    >
      <template v-slot:toolbar>
        <div class="flex justify-end w-full">
          <TButton type="link" @click="showEmails = !showEmails">
            {{ showEmails ? 'Hide emails' : 'Show emails' }}
          </TButton>
        </div>
        <textarea
          v-if="showEmails"
          v-model="emails"
          class="p-2 w-full rounded border"
          rows="10"
        ></textarea>
      </template>
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">
            {{ item.name }}
          </div>
          <div class="md:flex justify-between">
            <dl class="w-full">
              <div
                v-for="field in [
                  'email',
                  'city',
                  'timezone',
                  'slack',
                  'newsletter'
                ]"
                :key="field"
                class="flex"
              >
                <template v-if="item[field]">
                  <dt class="w-1/3 text-right mr-2 text-gray-500">
                    {{ field }}
                  </dt>
                  <dd>{{ item[field] }}</dd>
                </template>
              </div>
              <div class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  registered
                </dt>
                <dd>{{ getDate(item.createdAt) }}</dd>
              </div>
            </dl>
            <div class="md:w-1/3 mt-2 mb-2 md:mt-0">
              <img v-if="item.photo" :src="item.photo" alt="photo" />
            </div>
          </div>
          <TButton
            type="link"
            @click="
              showDetailsId === item.id
                ? (showDetailsId = false)
                : (showDetailsId = item.id)
            "
            >Participated in {{ item.eventsCount }} events</TButton
          >
          <div v-if="showDetailsId === item.id && item.eventsCount">
            <TCardList
              v-slot="{ item: event }"
              collection="meetups"
              :filters="[
                {
                  name: 'users',
                  default: true,
                  filter: (event) => item.events.includes(event.id)
                }
              ]"
            >
              <div class="p-2 border">
                {{ event.title }} on {{ getDate(event.date) }}
              </div>
            </TCardList>
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import TCardList from '~/components/TCardList'
import TButton from '~/components/TButton'
import { getDay, getTime, getDate } from '~/utils'
import useRSVP from '~/use/rsvp'

export default {
  components: {
    TCardList,
    TButton
  },
  data: () => ({
    emails: [],
    showEmails: false,
    showDetailsId: false
  }),
  setup() {
    const title = 'Accounts'
    const collection = 'accounts'

    const { can, isAdmin } = useAuth()
    const { getEvents } = useRSVP()

    const fields = []

    const map = (item) => ({
      ...item,
      events: getEvents(item.id, 'meetups'),
      eventsCount: getEvents(item.id, 'meetups').length || 0
    })

    const filters = [
      {
        name: 'new',
        label: 'New',
        default: true,
        sort: '-createdAt'
      },
      {
        name: 'active',
        label: 'Active',
        default: true,
        filter: (item) => item.eventsCount > 0,
        sort: '-eventsCount'
      },
      {
        name: 'slack',
        label: 'Slack',
        filter: (item) => item.slack === 'yes',
        sort: '-eventsCount'
      },
      {
        name: 'newsletter',
        label: 'Newsletter',
        filter: (item) => item.newsletter === 'yes',
        sort: '-eventsCount'
      },
      {
        name: 'unfinished',
        label: 'Unfinished',
        filter: (item) => !item.newsletter,
        sort: '-eventsCount'
      }
    ]

    return {
      can,
      getDay,
      getTime,
      getDate,
      filters,
      fields,
      title,
      collection,
      isAdmin,
      map
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
  },
  methods: {
    loadItems(items) {
      this.emails = items.map((item) => item.email)
    }
  }
}
</script>