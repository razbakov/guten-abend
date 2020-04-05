<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :fields="fields"
      :filters="filters"
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
          <div>
            {{ item.email }}
          </div>
          <div>City: {{ item.city }}</div>
          <div>Timezone: {{ item.timezone }}</div>
          <div>Slack: {{ item.slack }}</div>
          <div>Newsletter: {{ item.newsletter }}</div>
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

export default {
  components: {
    TCardList,
    TButton
  },
  data: () => ({
    emails: [],
    showEmails: false
  }),
  setup() {
    const title = 'Accounts'
    const collection = 'accounts'

    const { can, isAdmin } = useAuth()

    const fields = []

    const filters = [
      {
        name: 'all',
        label: 'All',
        default: true
      },
      {
        name: 'slack',
        label: 'Slack',
        filter: (item) => item.slack === 'yes'
      },
      {
        name: 'newsletter',
        label: 'Newsletter',
        filter: (item) => item.newsletter === 'yes'
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
      isAdmin
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
