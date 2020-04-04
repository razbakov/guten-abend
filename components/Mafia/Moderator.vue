<template>
  <div class="card">
    <TLoader v-if="loading" />
    <div v-else>
      <div class="border-b">
        <h1 class="text-3xl font-bold">Moderator</h1>
      </div>
      <div class="py-4 flex">
        <div v-if="playerIds.length > 2">
          <button class="btn-secondary mr-2" @click="assignPlaces">
            Assign places
          </button>
          <button class="btn-secondary mr-2" @click="assignRoles">
            Assign roles
          </button>
        </div>
        <div v-else class="text-red-500">
          We need minimum 3 players to start the game. There are only
          {{ playerIds.length }}.
        </div>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-bold">Players</h2>
        <div
          v-for="player in players"
          :key="player.id"
          class="flex items-center"
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
import useLiveDoc from '~/use/liveDoc'
import useRouter from '~/use/router'
import TLoader from '~/components/TLoader'
import { sortBy } from '~/utils'

export default {
  components: {
    TLoader
  },
  setup() {
    const { params } = useRouter()

    const id = params.id

    const { doc: game, update, loading } = useLiveDoc('mafia_games', id)

    return {
      game,
      update,
      loading
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
          role: this.game.roles[playerId]
        }))
        .sort(sortBy('place'))
    }
  },
  methods: {
    getRandom(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    assignPlaces() {
      const playerIds = Object.keys(this.game.players)
      const places = {}

      const dictionary = [...Array(playerIds.length).keys()]
      while (dictionary.length > 0) {
        const index = this.getRandom(dictionary.length)
        places[playerIds[0]] = dictionary[index] + 1
        dictionary.splice(index, 1)
        playerIds.splice(0, 1)
      }

      this.update({
        places
      })
    },
    assignRoles() {
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

      this.update({
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
