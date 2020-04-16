<template>
  <main class="mt-6 p-8">
    <p class="font-bold">Everything closed?</p>
    <h1 class="font-bold text-4xl">Meet New Friends Online</h1>
    <p class="text-lg">
      Mafia Game, Resistance, Pandemics, Geo Guess, CashFlow, Conversations,
      Fitness Online. Get Social. Meet Friends. Be Happy.
    </p>
    <div class="text-center mt-3 p-4 w-full md:flex">
      <nuxt-link v-if="!uid" to="/signup" class="block w-full btn m-2">
        Join Now
      </nuxt-link>
      <nuxt-link v-else to="/account" class="block w-full btn m-2">
        Go to my Account
      </nuxt-link>
      <nuxt-link to="/schedule" class="block w-full btn-secondary m-2"
        >See schedule</nuxt-link
      >
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>
