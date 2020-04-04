<template>
  <main class="p-4">
    <TLoader v-if="!profile" />
    <TCardList
      v-else
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
        <TRsvp :id="item.id" :collection="collection" :extra="profile">
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
import { ref, computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import { getDay, getTime, getDate } from '~/utils'
import TCardList from '~/components/TCardList'
import TRsvp from '~/components/TRsvp'
import TGuests from '~/components/TGuests'
import TLoader from '~/components/TLoader'

export default {
  middleware: ['auth'],
  components: {
    TCardList,
    TRsvp,
    TGuests,
    TLoader
  },
  setup() {
    const { can, uid } = useAuth()
    const { loadById, doc: profile } = useDoc('mafia_profiles')

    loadById(uid.value)

    const title = computed(() => `Welcome, ${profile.value?.nickname}!`)
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
      openedListId,
      profile
    }
  }
}
</script>
