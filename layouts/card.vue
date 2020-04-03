<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen"
  >
    <THeader />
    <div class="container w-full mx-auto md:max-w-xl px-4 pb-8">
      <div class="bg-white w-full shadow-md rounded px-8 pb-8 mb-4 pt-2">
        <TLoader v-if="!ready" />
        <nuxt v-else />
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import THeader from '~/components/THeader'
import TLoader from '~/components/TLoader'

export default {
  components: {
    THeader,
    TLoader
  },
  setup() {
    const { ready } = useAuth()

    return {
      ready
    }
  }
}
</script>
