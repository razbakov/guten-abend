<template>
  <main class="mt-6 p-8">
    <p class="font-bold">Everything closed?</p>
    <h1 class="font-bold text-4xl">We are open 24/7</h1>
    <p class="text-lg">
      Guten Abend is an online social hub to have fun via Zoom.
    </p>
    <div class="text-center mt-3 p-4 w-full md:flex">
      <nuxt-link to="/signup" class="block w-full btn m-2">
        {{ uid ? 'Go to my Account' : 'Join Now' }}
      </nuxt-link>
      <nuxt-link to="/schedule" class="block w-full btn-secondary m-2"
        >See schedule</nuxt-link
      >
    </div>
    <div v-if="isAdmin" class="p-6">
      <nuxt-link class="btn-secondary" to="/mafia/game">Mafia</nuxt-link>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  setup() {
    const { uid, isAdmin } = useAuth()

    return {
      uid,
      isAdmin
    }
  }
}
</script>
