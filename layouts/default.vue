<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen"
  >
    <div v-if="isAdmin" class="bg-black text-white p-2">
      <router-link class="p-2" to="/admin/pages">Pages</router-link>
      <router-link class="p-2" to="/accounts">Accounts</router-link>
      <router-link class="p-2" to="/rsvp">RSVP</router-link>
      <router-link class="p-2" to="/mafia/game">Mafia Game</router-link>
    </div>
    <THeader />
    <div class="container w-full mx-auto md:max-w-xl">
      <nuxt />
    </div>
  </div>
</template>

<script>
import THeader from '~/components/THeader'
import useAuth from '~/use/auth'

export default {
  components: {
    THeader
  },
  setup() {
    const { isAdmin } = useAuth()

    return {
      isAdmin
    }
  }
}
</script>
