<template>
  <div class="card">
    <TLoader v-if="loading" />
    <div v-else>
      <div class="mb-4 border-b">
        <h1 class="text-3xl font-bold">{{ profile.nickname }}</h1>
      </div>
      <div>
        <div v-if="game.places">Place: {{ game.places[uid] }}</div>
        <div v-if="game.roles">Role: {{ game.roles[uid] }}</div>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-bold">Players</h2>
        <div
          v-for="player in players"
          :key="player.id"
          class="flex items-center"
          :class="uid === player.id ? 'font-bold' : ''"
        >
          <div v-if="player.place" class="bg-gray-200 w-6 h-6 mr-2 text-center">
            {{ player.place }}
          </div>
          <div>{{ player.nickname }}</div>
          <div v-if="player.role" class="ml-2 text-center">
            - {{ player.role }}
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-bold">Game Set</h2>
        <div class="typo">
          <table>
            <tr>
              <td>Citizens</td>
              <td>{{ game.set.roles.citizen }}</td>
            </tr>
            <tr>
              <td>Mafia</td>
              <td>{{ game.set.roles.mafia }}</td>
            </tr>
            <tr>
              <td>Don</td>
              <td>{{ game.set.roles.don }}</td>
            </tr>
            <tr>
              <td>Sheriff</td>
              <td>{{ game.set.roles.sheriff }}</td>
            </tr>
            <tr class="font-bold">
              <td>Total</td>
              <td>{{ game.set.count }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useLiveDoc from '~/use/liveDoc'
import useRouter from '~/use/router'
import TLoader from '~/components/TLoader'
import { sortBy } from '~/utils'

export default {
  components: {
    TLoader
  },
  setup() {
    const { uid } = useAuth()
    const { params } = useRouter()

    const id = params.id

    const { doc: game, update } = useLiveDoc('mafia_games', id)
    const { loadById: loadProfile, doc: profile, loading } = useDoc(
      'mafia_profiles'
    )

    return {
      id,
      game,
      update,
      uid,
      profile,
      loadProfile,
      loading
    }
  },
  computed: {
    players() {
      return Object.keys(this.game.players)
        .map((playerId) => ({
          id: playerId,
          nickname: this.game.players[playerId].nickname,
          place: this.game.places[playerId]
        }))
        .sort(sortBy('place'))
    }
  },
  async mounted() {
    await this.loadProfile(this.uid)

    const changes = {
      [`players.${this.uid}`]: {
        active: true,
        nickname: this.profile.nickname
      }
    }

    await this.update(changes)
  }
}
</script>
