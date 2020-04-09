<template>
  <main class="p-4">
    <TLoader v-if="!nickname" />
    <TCardList
      v-else
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot="{ item }">
        <div class="p-4 card-item">
          <div class="font-bold text-xl mb-2">{{ item.title }}</div>
          <div class="bg-gray-200 p-2 mb-4 rounded border">
            <dl>
              <div class="flex">
                <dt class="w-1/3 text-right font-bold mr-2">Players</dt>
                <dd>
                  {{ item.players ? Object.keys(item.players).length : 0 }} / 10
                </dd>
              </div>
              <div v-if="item.winner" class="flex">
                <dt class="w-1/3 text-right font-bold mr-2">Winner</dt>
                <dd>{{ item.winner }}</dd>
              </div>
            </dl>
          </div>
          <router-link class="btn mt-2" :to="`/mafia/game/${item.id}`"
            >Open Game</router-link
          >
        </div>
      </template>
    </TCardList>

    <div v-if="can('import', 'mafia-game')" class="mt-8">
      <TButton type="secondary" @click="importingGame = true"
        >Import Game</TButton
      >
      <TForm
        v-if="importingGame"
        class="card-item p-4 mt-4"
        :show-cancel="true"
        :fields="importFields"
        @save="create"
        @cancel="importingGame = false"
      />
    </div>
  </main>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import { getDay, getTime, getDate } from '~/utils'
import TCardList from '~/components/TCardList'
import TLoader from '~/components/TLoader'
import TButton from '~/components/TButton'
import TForm from '~/components/TForm'
import TMafiaPlayers from '~/components/TMafiaPlayers'
import TMafiaRoles from '~/components/TMafiaRoles'

export default {
  middleware: ['auth', 'mafia'],
  components: {
    TCardList,
    TLoader,
    TButton,
    TForm
  },
  data: () => ({
    importingGame: false
  }),
  setup() {
    const { can, uid } = useAuth()
    const { loadById, doc } = useDoc('mafia_profiles')
    const { create } = useDoc('mafia_games')

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
      },
      {
        name: 'archived',
        type: 'select',
        options: ['yes', 'no'],
        default: 'no'
      }
    ]

    const filters = [
      {
        name: 'active',
        default: true,
        filter: (item) => item.archived !== 'yes'
      }
    ]

    const importFields = [
      ...fields,
      {
        name: 'date',
        label: 'Date',
        type: 'datetime-local'
      },
      {
        name: 'winner',
        type: 'select',
        options: ['city', 'mafia']
      },
      {
        name: 'players',
        component: TMafiaPlayers
      },
      {
        name: 'roles',
        component: TMafiaRoles
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
      nickname,
      importFields,
      create,
      filters
    }
  }
}
</script>
