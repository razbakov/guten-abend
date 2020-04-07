<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :filters="filters"
      :delete-item="true"
    >
      <template v-slot="{ item }">
        <div class="p-4 card-item">
          <div class="font-bold text-xl mb-2">
            {{ item.name }}
          </div>
          <div class="md:flex justify-between">
            <dl class="w-full">
              <div
                v-for="field in [
                  'feedback',
                  'uid',
                  'collection',
                  'eventId',
                  'rsvp'
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
              <div
                v-if="item.participant && item.participant.email"
                class="flex"
              >
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  email
                </dt>
                <dd>{{ item.participant.email }}</dd>
              </div>
              <div v-if="item.nickname" class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  nickname
                </dt>
                <dd>{{ item.nickname }}</dd>
              </div>
              <div
                v-if="item.participant && item.participant.name"
                class="flex"
              >
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  name
                </dt>
                <dd>{{ item.participant.name }}</dd>
              </div>
              <div v-if="item.event && item.event.title" class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  event
                </dt>
                <dd>{{ item.event.title }}</dd>
              </div>
              <div class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  responded
                </dt>
                <dd>{{ getDate(item.createdAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import TCardList from '~/components/TCardList'
import { getDay, getTime, getDate } from '~/utils'

export default {
  components: {
    TCardList
  },
  setup() {
    const title = 'RSVPs'
    const collection = 'participants'

    const { can, isAdmin } = useAuth()

    const fields = []

    const filters = [
      {
        name: 'new',
        label: 'New',
        default: true,
        sort: '-createdAt'
      },
      {
        name: 'yes',
        label: 'Yes',
        filter: (item) => item.rsvp === 'yes',
        sort: '-createdAt'
      },
      {
        name: 'no',
        label: 'No',
        filter: (item) => item.rsvp === 'no',
        sort: '-createdAt'
      },
      {
        name: 'feedback',
        label: 'Feedback',
        filter: (item) => !!item.feedback,
        sort: '-updatedAt'
      }
    ]

    return {
      can,
      getDay,
      getTime,
      getDate,
      fields,
      title,
      collection,
      isAdmin,
      filters
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
  }
}
</script>
