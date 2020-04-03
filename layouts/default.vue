<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen"
  >
    <THeader />
    <div class="container w-full mx-auto md:max-w-xl">
      <nuxt />
    </div>
  </div>
</template>

<script>
import THeader from '~/components/THeader'

export default {
  components: {
    THeader
  }
}
</script>
