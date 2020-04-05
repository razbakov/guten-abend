<template>
  <main class="p-4">
    <TLoader v-if="!nickname" />
    <TCardList
      v-else
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot:card-toolbar="{ item }">
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
        <div class="p-4 pb-6">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <router-link class="btn mt-2" :to="`/mafia/game/${item.id}`"
            >Open Game</router-link
          >
        </div>
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
import TLoader from '~/components/TLoader'

export default {
  middleware: ['auth', 'mafia'],
  components: {
    TCardList,
    TLoader
  },
  setup() {
    const { can, uid } = useAuth()
    const { loadById, doc } = useDoc('mafia_profiles')

    loadById(uid.value)

    const nickname = computed(() => doc?.value?.nickname)

    const title = computed(() => `Welcome, ${nickname.value}!`)
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
      nickname
    }
  }
}
</script>
