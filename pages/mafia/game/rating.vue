<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Mafia Game Rating</h1>

    <div v-for="player in players" :key="player.id" class="card-item p-4 mb-4">
      <div class="font-bold">{{ player.nickname }}</div>
      <div>Rating: {{ player.rating }}</div>
      <div>Games: {{ player.gamesCount }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useCollection from '~/use/collection'
import { sortBy } from '~/utils'

export default {
  setup() {
    const { docs: profiles } = useCollection('mafia_profiles')
    const { docs: games } = useCollection('mafia_games')

    const players = computed(() => {
      if (!games.value || !profiles.value) {
        return []
      }

      return profiles.value
        .map((profile) => {
          const rating = games.value
            .filter((g) => g.rating && g.rating[profile.id])
            .map((g) => g.rating[profile.id])
            .reduce((prev, curr) => prev + curr, 0)

          const gamesCount = games.value.filter(
            (g) => g.players && g.players[profile.id]
          ).length

          return {
            ...profile,
            rating,
            gamesCount
          }
        })
        .filter((g) => g.gamesCount > 0)
        .sort(sortBy('-rating'))
    })

    return {
      players,
      games
    }
  }
}
</script>
