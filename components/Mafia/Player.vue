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
        <div class="typo">
          <table>
            <tr
              v-for="player in players"
              :key="player.id"
              :class="uid === player.id ? 'font-bold' : ''"
            >
              <td class="text-center">
                <div class="bg-gray-200 w-6 h-6">
                  {{ player.place }}
                </div>
              </td>
              <td>{{ player.nickname }}</td>
              <td class="w-12">
                {{ left(player.voice) }}
              </td>
            </tr>
          </table>
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
import { ref } from '@vue/composition-api'
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

    const now = ref(0)

    setInterval(() => {
      now.value = +new Date()
    }, 500)

    return {
      id,
      game,
      update,
      uid,
      profile,
      loadProfile,
      loading,
      now
    }
  },
  computed: {
    players() {
      return Object.keys(this.game.players)
        .map((playerId) => ({
          id: playerId,
          nickname: this.game.players[playerId].nickname,
          place: this.game.places[playerId],
          voice: (this.game.voice && this.game.voice[playerId]) ?? 0
        }))
        .sort(sortBy('place'))
    }
  },
  async mounted() {
    await this.loadProfile(this.uid)

    await this.update({
      [`players.${this.uid}`]: {
        active: true,
        nickname: this.profile.nickname
      }
    })
  },

  methods: {
    left(end) {
      if (!end) {
        return 0
      }

      const result = Math.round((end - this.now) / 1000)

      if (result < 0 || result > 60) {
        return 0
      }

      return result
    }
  }
}
</script>
