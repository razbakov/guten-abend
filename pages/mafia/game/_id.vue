<template>
  <TLoader v-if="loading" />
  <GameModerator v-else-if="isCreator" />
  <GamePlayer v-else />
</template>

<script>
import useDoc from '~/use/doc'
import useRouter from '~/use/router'
import GameModerator from '~/components/Mafia/Moderator'
import GamePlayer from '~/components/Mafia/Player'
import TLoader from '~/components/TLoader'

export default {
  middleware: ['auth'],
  components: {
    GameModerator,
    GamePlayer,
    TLoader
  },
  setup() {
    const { params } = useRouter()
    const { loadById, doc, isCreator, loading } = useDoc('mafia_games')

    loadById(params.id)

    return {
      doc,
      isCreator,
      loading
    }
  }
}
</script>
