<template>
  <div class="card">
    <TLoader v-if="loading || !exists" />
    <div v-else>
      <div class="border-b">
        <h1 class="text-3xl font-bold">{{ game.title }}</h1>
      </div>
      <div v-if="isCreator" class="py-4 flex">
        <div>
          <button
            v-if="playerIds.length"
            class="btn-secondary mr-2"
            @click="assignPlaces"
          >
            Assign places
          </button>
          <button
            v-if="playerIds.length"
            class="btn-secondary mr-2"
            @click="assignRoles"
          >
            Assign roles
          </button>
          <button
            class="mr-2"
            :class="playing ? 'btn' : 'btn-secondary'"
            @click="autoPilot"
          >
            Auto pilot
          </button>
          <button class="btn-secondary mr-2" @click="reset">
            Reset
          </button>
        </div>
      </div>
      <div v-if="playing" class="p-2">
        <div v-if="profile">Name: {{ profile.nickname }}</div>
        <div v-if="game.places">Place: {{ game.places[uid] }}</div>
        <div v-if="game.roles">Role: {{ game.roles[uid] }}</div>
      </div>
      <div v-if="game.winner" class="text-red-500 my-2 font-bold">
        {{ game.winner }} won!
      </div>
      <div v-if="playerIds.length < 3" class="text-red-500 my-2">
        We need minimum 3-10 players to start the game. There are only
        {{ playerIds.length }}.
      </div>
      <div v-if="players.length" class="mt-4">
        <div class="flex">
          <h2 class="text-xl font-bold">Players</h2>
          <template v-if="isCreator">
            <button
              class="p-1 text-gray-500"
              :class="sortOrder === 'place' ? 'font-bold' : ''"
              @click="sortOrder = 'place'"
            >
              By Place
            </button>
            <button
              class="p-1 text-gray-500"
              :class="sortOrder === 'order' ? 'font-bold' : ''"
              @click="sortOrder = 'order'"
            >
              By Order
            </button>
            <button
              v-if="isCreator"
              class="p-1 text-gray-500"
              @click="nominate(null)"
            >
              Clear nominations
            </button>
            <button
              v-if="isCreator"
              class="p-1 text-gray-500"
              @click="vote(null)"
            >
              Clear votes
            </button>
          </template>
        </div>

        <div class="typo">
          <table>
            <tr
              v-for="player in players"
              :key="player.id"
              :class="{
                'font-bold': activeVoice === player.id,
                'text-red-200': !player.active
              }"
            >
              <td class="text-center">
                <div class="bg-gray-200 w-6 h-6">
                  {{ player.place }}
                </div>
              </td>
              <td v-if="isCreator">
                {{ player.order }}
              </td>
              <td>{{ player.nickname }}</td>
              <td v-if="!playing">
                {{ player.role }}
              </td>
              <td class="w-12">
                {{ left(player.voice) }}
              </td>
              <td v-if="isCreator">
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
              <td v-if="isCreator">
                <button
                  v-if="activeVoice && !game.nominated[player.id]"
                  class="bg-gray-200 p-1 border rounded m-1"
                  @click="nominate(player.id)"
                >
                  Nom
                </button>
                <button
                  class="bg-gray-200 p-1 border rounded m-1"
                  @click="kill(player.id)"
                >
                  Kill
                </button>
              </td>
              <td v-if="isCreator">
                <div v-if="player.order">
                  <div v-if="player.votes">{{ player.votes }}</div>
                  <button
                    v-for="i in votesLeft"
                    v-else
                    :key="i"
                    class="bg-gray-200 p-1 mr-1 border rounded"
                    @click="vote(player.id, i + 1)"
                  >
                    {{ i + 1 }}
                  </button>
                </div>
              </td>
              <td v-if="game.winner">
                {{ player.rating }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="game.set && game.set.roles" class="mt-4">
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
import { ref, computed } from '@vue/composition-api'
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

    const { doc: game, update, loading, isCreator, exists } = useLiveDoc(
      'mafia_games',
      id
    )
    const { loadById: loadProfile, doc: profile } = useDoc('mafia_profiles')

    const now = ref(0)
    const sortOrder = ref('place')
    const playing = computed(
      () => (isCreator.value && game.value.auto) || !isCreator.value
    )

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
      uid,
      isCreator,
      exists,
      sortOrder
    }
  },
  computed: {
    votesLeft() {
      const playerCount = this.players.filter((player) => player.active).length
      const votesCount = this.players
        .map((player) => player.votes)
        .reduce((prev, current) => prev + current)

      const count = playerCount - votesCount

      return [...Array(count).keys()]
    },
    activeVoice() {
      return this.game.voice
        ? Object.keys(this.game.voice).find((item) => item)
        : false
    },
    playerIds() {
      return this.game.players ? Object.keys(this.game.players) : []
    },
    players() {
      return this.game.players
        ? Object.keys(this.game.players)
            .map((playerId) => ({
              id: playerId,
              nickname: this.game.players[playerId]?.nickname,
              place: this.game.places ? this.game.places[playerId] : '',
              role: this.game.roles ? this.game.roles[playerId] : '',
              voice: (this.game.voice && this.game.voice[playerId]) ?? 0,
              active: !this.game.dead || !this.game.dead[playerId],
              votes: (this.game.votes && this.game.votes[playerId]) ?? 0,
              rating: (this.game.rating && this.game.rating[playerId]) ?? 0,
              order:
                this.game.nominated && this.game.nominated[playerId]
                  ? this.game.nominated[playerId].order
                  : ''
            }))
            .sort(sortBy(this.sortOrder))
        : []
    }
  },
  watch: {
    exists(val) {
      if (!val) {
        this.$router.replace('/mafia/game')
      }
    }
  },
  async mounted() {
    if (!this.loading && !this.exists) {
      this.$router.replace('/mafia/game')
    }

    await this.loadProfile(this.uid)

    if (this.playing) {
      await this.update({
        [`players.${this.uid}`]: {
          active: true,
          nickname: this.profile.nickname
        }
      })
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
    async kill(playerId) {
      await this.update({
        [`dead.${playerId}`]: !this.game.dead[playerId]
      })

      const activePlayers = this.players.filter((player) => player.active)
      const citizenCount = activePlayers.filter(
        (player) => player.role === 'citizen' || player.role === 'sheriff'
      ).length
      const mafiaCount = activePlayers.filter(
        (player) => player.role === 'mafia' || player.role === 'don'
      ).length

      if (mafiaCount === citizenCount) {
        await this.update({
          winner: 'mafia',
          rating: {}
        })

        activePlayers
          .filter((player) => player.role === 'mafia' || player.role === 'don')
          .map((player) => player.id)
          .forEach((id) => {
            this.update({
              [`rating.${id}`]: 2
            })
          })
      }

      if (mafiaCount === 0) {
        await this.update({
          winner: 'city',
          rating: {}
        })

        activePlayers
          .filter(
            (player) => player.role === 'citizen' || player.role === 'sheriff'
          )
          .map((player) => player.id)
          .forEach((id) => {
            this.update({
              [`rating.${id}`]: 2
            })
          })
      }
    },
    async vote(playerId, voteCount) {
      if (!playerId) {
        await this.update({
          votes: {}
        })

        return
      }

      await this.update({
        [`votes.${playerId}`]: voteCount
      })
    },
    async nominate(to) {
      if (!to) {
        await this.vote(null)

        await this.update({
          nominated: {}
        })

        return
      }

      const now = +new Date()
      const order = this.game.nominated
        ? Object.keys(this.game.nominated).length + 1
        : 1

      await this.update({
        [`nominated.${to}`]: {
          order,
          time: now,
          from: this.activeVoice
        }
      })
    },
    async start(playerId, time) {
      await this.update({
        voice: {
          [playerId]: +new Date() + time * 1000
        }
      })
    },
    async autoPilot() {
      if (this.playing) {
        await this.update({
          auto: false
        })

        return
      }

      await this.loadProfile(this.uid)

      await this.update({
        [`players.${this.uid}`]: {
          active: true,
          nickname: this.profile.nickname
        },
        auto: true
      })

      await this.assignPlaces()
      await this.assignRoles()
    },
    getRandom(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    async reset() {
      await this.update({
        places: {},
        roles: {},
        set: {},
        voice: {},
        players: {},
        dead: {},
        votes: {},
        nominated: {},
        rating: {},
        winner: ''
      })
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
        1: {
          citizen: 1,
          mafia: 0,
          don: 0,
          sheriff: 0
        },
        2: {
          citizen: 1,
          mafia: 1,
          don: 0,
          sheriff: 0
        },
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
