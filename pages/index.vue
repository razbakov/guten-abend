<template>
  <main class="w-full mt-6 mx-auto md:max-w-xl p-8 flex">
    <div class="self-center">
      <p class="font-bold">Everything closed?</p>
      <h1 class="font-bold text-4xl">We are open 24/7</h1>
      <p class="text-lg">
        Guten Abend is an online social hub to socialize and have fun via Zoom.
      </p>
      <div
        class="container text-center mt-3 p-4 w-full mx-auto md:flex justify-center"
      >
        <nuxt-link to="/signup" class="block btn m-2">
          {{ uid ? 'Go to my Profile' : 'Join Now' }}
        </nuxt-link>
        <nuxt-link to="/schedule" class="block btn-secondary m-2"
          >See schedule</nuxt-link
        >
      </div>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth.js'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>
