<template>
  <main class="p-4">
    <div class="md:flex items-baseline justify-between mb-4">
      <h1 class="text-3xl font-bold">Mafia Dashboard</h1>
      <button v-if="isAdmin" class="btn" @click="addingGame = true">
        Create Game
      </button>
    </div>

    <MafiaGameCard v-if="addingGame" editing @cancel="addingGame = false" />

    <div v-if="games.length">
      <MafiaGameCard v-for="game in games" :key="game.id" :game="game" />
    </div>
    <div v-else-if="!addingGame" class="p-4">
      There are no games yet.
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useCollection from '~/use/collection'
import MafiaGameCard from '~/components/MafiaGameCard'

export default {
  components: {
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
