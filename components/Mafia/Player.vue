<template>
  <div class="card">
    <TLoader v-if="loading" />
    <div v-else>
      <div class="mb-4 border-b">
        <h1 class="text-3xl font-bold">{{ profile.nickname }}</h1>
      </div>
      <div>
        <div v-if="game.places">Player Number: {{ game.places[uid] }}</div>
        <div v-if="game.roles">Role: {{ game.roles[uid] }}</div>
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
  computed: {},
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
