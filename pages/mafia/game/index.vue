<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot:toolbar="{ item }">
        <button
          v-if="can('manage', collection, item)"
          class="underline mr-2"
          @click="
            !openedListId ? (openedListId = item.id) : (openedListId = false)
          "
        >
          Players
        </button>
      </template>
      <template v-slot="{ item }">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <p class="text-gray-700 text-base">
            Created {{ getDate(item.createdAt) }} at
            {{ getTime(item.createdAt) }} UTC
          </p>
          <TGuests v-if="openedListId === item.id" :id="item.id" class="p-4" />
        </div>
        <TRsvp :id="item.id" :collection="collection">
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
import { ref } from '@vue/composition-api'
import useAuth from '~/use/auth'
import { getDay, getTime, getDate } from '~/utils'
import TCardList from '~/components/TCardList'
import TRsvp from '~/components/TRsvp'
import TGuests from '~/components/TGuests'

export default {
  components: {
    TCardList,
    TRsvp,
    TGuests
  },
  setup() {
    const { can } = useAuth()

    const title = 'Mafia Dashboard'
    const collection = 'mafia_games'
    const add = 'Create game'

    const openedListId = ref(false)

    const fields = [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Give it a funny name'
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
      add,
      openedListId
    }
  }
}
</script>
