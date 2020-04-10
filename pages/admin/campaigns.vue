<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot:card-toolbar="{ item }">
        <button
          v-if="can('analytics', collection, item)"
          class="p-2 hover:text-primary"
          @click="
            peopleId !== item.id ? (peopleId = item.id) : (peopleId = false)
          "
        >
          <TPeopleIcon :class="peopleId === item.id ? 'text-primary' : ''" />
        </button>
      </template>
      <template v-slot="{ item }">
        <div v-if="peopleId === item.id" class="p-4 card-item">
          <div
            v-for="(recipient, uid) in item.recipients"
            :key="uid"
            class="flex items-center"
          >
            <div class="mr-4">
              <div>{{ recipient.name }}</div>
              <div class="text-sm text-gray-500">{{ recipient.email }}</div>
            </div>
            <div class="flex">
              <div v-for="(styles, field) in states" :key="field">
                <div
                  v-if="recipient[field]"
                  :class="styles"
                  :title="field + ' ' + getDateTime(recipient[field])"
                  class="rounded-full w-4 h-4 mr-2"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-4 card-item">
          <div class="font-bold text-xl">
            {{ item.title }}
          </div>
          <div class="mb-2 text-gray-500 font-bold">{{ item.status }}</div>
          <div class="mb-2 text-gray-500">Subject: {{ item.subject }}</div>
          <div class="mb-2 text-gray-500">
            Scheduled for {{ getDate(item.scheduledAt) }} at
            {{ getTime(item.scheduledAt) }}
          </div>
          <div v-if="item.recipients" class="mb-2 text-gray-500">
            {{ Object.keys(item.recipients).length }} recipients
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import TCardList from '~/components/TCardList'
import TAccountSelector from '~/components/TAccountSelector'
import TPeopleIcon from '~/components/icons/People'
import {
  getDate,
  getDateTime,
  getTime,
  getDateObect,
  toDatetimeLocal
} from '~/utils'

export default {
  components: {
    TCardList,
    TPeopleIcon
  },
  data: () => ({
    data: '',
    peopleId: false,
    states: {
      deliveredAt: 'bg-green-500',
      openedAt: 'bg-green-500',
      clickedAt: 'bg-green-500',
      failedAt: 'bg-red-500',
      spammedAt: 'bg-orange-500',
      unsubscribedAt: 'bg-orange-500'
    }
  }),
  setup() {
    const { can } = useAuth()
    const title = 'Email Campaigns'
    const collection = 'campaigns'
    const add = 'New campaign'

    const fields = [
      {
        name: 'title'
      },
      {
        name: 'subject'
      },
      {
        name: 'from',
        default: 'Aleksey from Guten Abend <gutenabend@razbakov.com>'
      },
      {
        name: 'status',
        type: 'select',
        options: ['draft', 'scheduled', 'sent', 'canceled']
      },
      {
        name: 'scheduledAt',
        type: 'datetime-local',
        set: (val) => {
          if (!val) return ''
          return new Date(val)
        },
        get: (val) => {
          if (!val) return ''
          return toDatetimeLocal(getDateObect(val))
        }
      },
      {
        name: 'recipients',
        component: TAccountSelector
      },
      {
        name: 'content',
        hideLabel: true,
        type: 'markdown'
      }
    ]

    return {
      fields,
      title,
      collection,
      add,
      getDate,
      getTime,
      getDateTime,
      can
    }
  }
}
</script>
