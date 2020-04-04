<template>
  <div class="card">
    <TLoader v-if="loading" />
    <div v-else>
      <div class="border-b">
        <h1 class="text-3xl font-bold">Moderator</h1>
      </div>
      <div v-if="playing">
        <div v-if="profile">Playing as: {{ profile.nickname }}</div>
        <div v-if="game.places">Place: {{ game.places[uid] }}</div>
        <div v-if="game.roles">Role: {{ game.roles[uid] }}</div>
      </div>
      <div class="py-4 flex">
        <div v-if="playerIds.length > 2">
          <button class="btn-secondary mr-2" @click="assignPlaces">
            Assign places
          </button>
          <button class="btn-secondary mr-2" @click="assignRoles">
            Assign roles
          </button>
          <button
            class="mr-2"
            :class="playing ? 'btn' : 'btn-secondary'"
            @click="autoPilot"
          >
            Auto pilot
          </button>
        </div>
        <div v-else class="text-red-500">
          We need minimum 3 players to start the game. There are only
          {{ playerIds.length }}.
        </div>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-bold">Players</h2>
        <div class="typo">
          <table>
            <tr v-for="player in players" :key="player.id">
              <td class="text-center">
                <div class="bg-gray-200 w-6 h-6">
                  {{ player.place }}
                </div>
              </td>
              <td>{{ player.nickname }}</td>
              <td v-if="!playing">
                {{ player.role }}
              </td>
              <td class="w-12">
                {{ left(player.voice) }}
              </td>
              <td>
                <button
                  class="bg-gray-200 p-1 border rounded"
                  @click="start(player.id, 60)"
                >
                  60s
                </button>
                <button
                  class="bg-gray-200 p-1 border rounded"
                  @click="start(player.id, 30)"
                >
                  30s
                </button>
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

    const { doc: game, update, loading } = useLiveDoc('mafia_games', id)
    const { loadById: loadProfile, doc: profile } = useDoc('mafia_profiles')

    const now = ref(0)
    const playing = ref(false)

    setInterval(() => {
      now.value = +new Date()
    }, 500)

    return {
      game,
      update,
      loading,
      now,
      loadProfile,
      profile,
      playing,
      uid
    }
  },
  computed: {
    playerIds() {
      return Object.keys(this.game.players)
    },
    players() {
      return Object.keys(this.game.players)
        .map((playerId) => ({
          id: playerId,
          nickname: this.game.players[playerId].nickname,
          place: this.game.places[playerId],
          role: this.game.roles[playerId],
          voice: (this.game.voice && this.game.voice[playerId]) ?? 0
        }))
        .sort(sortBy('place'))
    }
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
    },
    start(playerId, time) {
      this.update({
        voice: {
          [playerId]: +new Date() + time * 1000
        }
      })
    },
    async autoPilot() {
      if (this.playing) {
        this.playing = false
        return
      }

      this.playing = true

      await this.loadProfile(this.uid)
      await this.update({
        [`players.${this.uid}`]: {
          active: true,
          nickname: this.profile.nickname
        }
      })

      await this.assignPlaces()
      await this.assignRoles()
    },
    getRandom(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    async assignPlaces() {
      const playerIds = Object.keys(this.game.players)
      const places = {}

      const dictionary = [...Array(playerIds.length).keys()]
      while (dictionary.length > 0) {
        const index = this.getRandom(dictionary.length)
        places[playerIds[0]] = dictionary[index] + 1
        dictionary.splice(index, 1)
        playerIds.splice(0, 1)
      }

      await this.update({
        places
      })
    },
    async assignRoles() {
      const playerIds = this.playerIds
      const count = playerIds.length
      const roles = {}

      const combinations = {
        3: {
          citizen: 2,
          mafia: 1,
          don: 0,
          sheriff: 0
        },
        4: {
          citizen: 3,
          mafia: 1,
          don: 0,
          sheriff: 0
        },
        5: {
          citizen: 4,
          mafia: 1,
          don: 0,
          sheriff: 0
        },
        6: {
          citizen: 4,
          mafia: 0,
          don: 1,
          sheriff: 1
        },
        7: {
          citizen: 4,
          mafia: 1,
          don: 1,
          sheriff: 1
        },
        8: {
          citizen: 5,
          mafia: 1,
          don: 1,
          sheriff: 1
        },
        9: {
          citizen: 5,
          mafia: 2,
          don: 1,
          sheriff: 1
        },
        10: {
          citizen: 6,
          mafia: 2,
          don: 1,
          sheriff: 1
        }
      }

      const dictionary = []

      const set = combinations[count]
      Object.keys(set).forEach((role) => {
        for (let i = 0; i < set[role]; i++) {
          dictionary.push(role)
        }
      })

      while (dictionary.length > 0) {
        const index = this.getRandom(dictionary.length)
        roles[playerIds[0]] = dictionary[index]
        dictionary.splice(index, 1)
        playerIds.splice(0, 1)
      }

      await this.update({
        roles,
        set: {
          count,
          roles: set
        }
      })
    }
  }
}
</script>
