<template>
  <div class="container w-full mx-auto md:max-w-xl px-4 pb-8">
    <div class="typo bg-white w-full shadow-md rounded px-8 pb-8 mb-4 pt-2">
      <TLoader v-if="!ready" />
      <div v-else>
        <div class="flex items-baseline justify-between">
          <h1>Mafia Dashboard</h1>
          <button v-if="isAdmin" class="btn" @click="addingGame = true">
            Create Game
          </button>
        </div>

        <MafiaGameCard
          v-if="addingGame"
          :editing="true"
          @save="addingGame = false"
        />

        <div v-if="games.length">
          <MafiaGameCard v-for="game in games" :key="game.id" :game="game" />
        </div>
        <div v-else-if="!addingGame">
          <div class="p-4">There are no games yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth.js'
import useDoc from '~/use/collection.js'
import useCollection from '~/use/collections.js'
import TLoader from '~/components/TLoader.vue'
import MafiaGameCard from '~/components/MafiaGameCard.vue'

export default {
  components: {
    TLoader,
    MafiaGameCard
  },
  data: () => ({
    addingGame: false
  }),
  setup() {
    const { uid, ready, isAdmin } = useAuth()
    const { docs: games } = useCollection('mafia_games')
    const { loadById, doc: profile } = useDoc('mafia_profiles')

    loadById(uid.value)

    return {
      uid,
      ready,
      profile,
      isAdmin,
      games
    }
  }
}
</script>
