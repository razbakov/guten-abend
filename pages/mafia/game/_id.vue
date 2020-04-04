<template>
  <GameModerator v-if="isCreator" />
  <GamePlayer v-else />
</template>

<script>
import useDoc from '~/use/doc'
import useRouter from '~/use/router'
import GameModerator from '~/components/Mafia/Moderator'
import GamePlayer from '~/components/Mafia/Player'

export default {
  components: {
    GameModerator,
    GamePlayer
  },
  setup() {
    const { params } = useRouter()
    const { loadById, doc, isCreator } = useDoc('mafia_games')

    loadById(params.id)

    return {
      doc,
      isCreator
    }
  }
}
</script>
