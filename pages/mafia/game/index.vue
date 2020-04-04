<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot:toolbar="{ item }">
        <nuxt-link
          v-if="can('manage', collection, item)"
          class="underline mr-2"
          :to="`/schedule/${item.id}`"
        >
          Players
        </nuxt-link>
      </template>
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <p class="text-gray-700 text-base">
            Created {{ getDate(item.createdAt) }} at
            {{ getTime(item.createdAt) }} UTC
          </p>
        </div>
        <TRsvp :item="item" :collection="collection">
          <template v-slot:header="{ count }">
            {{ count }} participants. Do you want to join?
          </template>
          <template v-slot:default>
            <div class="flex px-6 py-4 bg-gray-200 text-gray-700">
              <router-link class="btn" :to="`/mafia/game/${item.id}`"
                >Start Game</router-link
              >
            </div>
          </template>
        </TRsvp>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import useUtils from '~/use/utils'
import TCardList from '~/components/TCardList'
import TRsvp from '~/components/TRsvp'

export default {
  components: {
    TCardList,
    TRsvp
  },
  data: () => ({
    title: 'Mafia Dashboard',
    collection: 'mafia_games',
    add: 'Create game',
    fields: [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Give it a funny name'
      }
    ]
  }),
  setup() {
    const { can } = useAuth()
    const { getDay, getTime, getDate } = useUtils()

    return {
      can,
      getDay,
      getTime,
      getDate
    }
  }
}
</script>
